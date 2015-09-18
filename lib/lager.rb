require 'net/http'
require 'uri'

class App
  helpers do
    def protected!
      return if authorized?
      headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
    end

    def authorized?
      @auth ||=  Rack::Auth::Basic::Request.new(request.env)
      if @auth.provided? && @auth.basic? && @auth.credentials
        user = User.where(username: @auth.credentials[0]).last
        user && user.valid_token?(@auth.credentials[1])
      else
        false
      end
    end

    def check_credentials
      @auth ||=  Rack::Auth::Basic::Request.new(request.env)
      if @auth.provided? && @auth.basic? && @auth.credentials
        user = User.where(
          username: @auth.credentials[0],
        ).last
        if user && user.password == @auth.credentials[1]
          return user
        end
      end
      return nil
    end
  end

  get '/' do
    erb :index
  end

  get '/servers' do
    protected!
    @servers = Server.all;
    content_type :json
    @servers.to_json
  end

  post '/servers' do
    protected!
    server_params = params["server"]
    halt(401, "Not authorized") unless server_params
    server = Server.create(host: server_params["host"], label: server_params["label"])
  end

  get '/logs/server/:id' do
    protected!
    id = params[:id]
    @server = Server.find(id);
    content_type :json
    @server.to_json
  end

  get '/servers/new' do
    protected!
    erb :new_server
  end

  get '/services' do
    protected!
    @services = Service.includes(:servers).all;
    content_type :json
    @services.to_json(:include => :servers)
  end

  post '/services' do
    protected!
    services_params = params["services"]
    halt(401, "Not authorized") unless services_params
    services_params["servers"].each do |server_name|
      server = Server.find_by(label: server_name)
      server.services.create(name: services_params["name"], service_type: 'db')
    end
  end

  get '/service/:id' do
    protected!
    @service = Service.find(params[:id]);
    content_type :json
    @service.to_json
  end

  get '/services/new' do
    protected!
    erb :new_service
  end

  get '/logs/service/:id' do
    protected!
    @id = params[:id]
    erb :log
  end

  get '/server/:id/status' do
    protected!
    begin
      @server = Server.find(params[:id])
      response = Net::HTTP.get_response(URI.parse(@server["host"]))
      currentStatus = response.code
      content_type :json
      currentStatus.to_json
    rescue Errno::ECONNREFUSED
      currentStatus = "500"
      content_type :json
      currentStatus.to_json
    end
  end

  post '/user/auth' do
    user = check_credentials
    if user.nil?
      headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
    else
      return { auth_token: user.auth_token }.to_json
    end
  end

  post '/user/logout' do
    user = check_credentials
    if user.nil?
      headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
    else
      user.regenerate_token
      return
    end
  end
end

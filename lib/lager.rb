require 'net/http'
require 'uri'

class App
  helpers do
    def protected!
      return if !!authorized_user
      respond_as_unauthorized
    end

    def authorized_user
      @auth ||=  Rack::Auth::Basic::Request.new(request.env)
      if @auth.provided? && @auth.basic? && @auth.credentials
        return check_token_and_get_user(
          username: @auth.credentials[0],
          auth_token: @auth.credentials[1]
        )
      else
        return nil
      end
    end

    def check_token_and_get_user(params)
      user = User.where(username: params[:username]).last
      if user && user.valid_token?(params[:auth_token])
        return user
      end
      return nil
    end

    def check_password_and_get_user(params)
      user = User.where(
        username: params[:username],
      ).last
      if user && user.password == params[:password]
        return user
      end
      return nil
    end

    def respond_as_unauthorized
      headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
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
    respond_as_unauthorized unless server_params
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
    respond_as_unauthorized unless services_params
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

  post '/user/?' do
    user = User.new
    user.username = params[:username]
    user.password = params[:password]
    user.save!
    return { auth_token: user.auth_token }
  end

  post '/user/auth' do
    user = check_password_and_get_user(params)
    if user.nil?
      respond_as_unauthorized
    else
      return { auth_token: user.auth_token }.to_json
    end
  end

  post '/user/logout' do
    user = authorized_user
    if user.nil?
      respond_as_unauthorized
    else
      user.regenerate_token
      return
    end
  end
end

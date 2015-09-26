require 'net/http'
require 'uri'
require 'net/ping'

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
      # headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
      halt 401, "Not authorized\n"
    end
  end

  get '/' do
    erb :index
  end

  get '/init' do
    if !User.count.zero?
      @success = false
    else
      user = User.first_or_create(
        username: params[:username] || 'admin',
        password: params[:password] || 'admin'
      )
      @success = true if user.valid?
    end
    erb :init
  end

  get '/servers' do
    @servers = Server.includes(:services).all;
    content_type :json
    @servers.to_json(:include => :services)
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
    erb :new_server
  end

  get '/services' do
    protected!
    @services = Service.includes(:servers).all;
    content_type :json
    @services.to_json(:include => :servers)
  end

  post '/services' do
    services_params = params["services"]
    halt(400, "Services Params missing") unless services_params

    service = Service.create(
      name: services_params["name"],
      service_type: services_params["service_type"],
      log_path: services_params["log_path"]
    )
    halt(400, service.errors.to_json) unless service.valid?

    service.servers << services_params["servers"].map do |server_name|
      Server.find_by(host: server_name)
    end
    service.save!
    service.to_json
  end

  get '/service/:id' do
    protected!
    @service = Service.find(params[:id]);
    content_type :json
    @service.to_json
  end

  get '/services/new' do
    @log_paths = YAML.load_file('log_paths.yml')
    erb :new_service
  end

  get '/logs/service/:id' do
    @id = params[:id]
    erb :log
  end

  get '/server/:id/status' do
    protected!
    server = Server.find(params[:id])
    check = Net::Ping::External.new(server["host"])
    status  = {"status" => check.ping}
    content_type :json
    status.to_json
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

  get '/init_script' do
    build_script = File.read('./public/init_scripts/init_server_template')
    public_key = File.read("#{Dir.home}/.ssh/id_rsa.pub").strip
    server_ip = `dig @ns1.google.com -t txt o-o.myaddr.l.google.com +short | tr -d '"'`.strip
    build_script.gsub!('PUBLICKEY', public_key)
    build_script.gsub!('LAGER_HOST', "http://#{server_ip}:4000")

    File.open('./public/init_scripts/init_server.sh', 'w') do |init_script|
      init_script.write(build_script)
    end
    redirect '/init_scripts/init_server.sh'
  end
end

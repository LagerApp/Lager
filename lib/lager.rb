class App
  get '/' do
    erb :index
  end

  get '/servers' do
    @servers = Server.all;
    content_type :json
    @servers.to_json
  end

  get '/logs/server/all' do
    @servers = Server.all;
    content_type :json
    @servers.to_json
  end

  get '/logs/service/all' do
    @services = Service.all;
    content_type :json
    @services.to_json
  end

  post '/servers' do
    server_params = params["server"]
    halt(401, "Not authorized") unless server_params
    server = Server.new(host: server_params["name"], ip: server_params["ip"])
    p server
    erb :index
  end

  get '/logs/server/:id' do
    id = params[:id]
    @server = Server.find(id);
    content_type :json
    @server.to_json
  end

  get '/servers/new' do
    erb :new_server
  end

  get '/services' do
    @services = Service.includes(:servers).all;
    content_type :json
    @services.to_json(:include => :servers)
  end

  get '/service/:id' do
    @service = Service.find(params[:id]);
    content_type :json
    @service.to_json
  end

  get '/services/new' do
    erb :new_service
  end

  get '/logs/service/:id' do
    @id = params[:id]
    erb :log
  end
end

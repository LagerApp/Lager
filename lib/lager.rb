class App
  get '/' do
    erb :index
  end

  get '/servers' do
    @servers = Server.all;
    content_type :json
    @servers.to_json
  end

  get '/server/:id' do
    @server = Server.find(params[:id]);
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

class App

  SERVICES = [
    {},
    {
      service: {
        id: 1,
        name: "Service 1",
        websocket_url: "ws://localhost:4001"
      }
    },
    {
      service: {
        id: 2,
        name: "Service 2",
        websocket_url: "ws://localhost:4001"
      }
    },
    {
      service: {
        id: 3,
        name: "Service 3",
        websocket_url: "ws://localhost:4001"
      }
    }
  ]

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

  get '/logs/server/:id' do
    id = params[:id]
    @server = Server.find(id);
    content_type :json
    @server.to_json
  end

  get '/logs/service/:id' do
    id = params[:id]
    @service = Service.find(id);
    content_type :json
    @service.to_json
  end

  get '/' do
    erb :index
  end

  get '/servers/new' do
    erb :new_server
  end

  get '/services/new' do
    erb :new_service
  end
  get '/logs/service' do
    @id = params[:id]
    erb :log
  end

  get '/logs/service.json' do
    service_id = params[:id]
    halt(404) unless service_id
    service = SERVICES[service_id.to_i]
    content_type :json
    service.to_json
  end

end

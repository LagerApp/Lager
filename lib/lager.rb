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

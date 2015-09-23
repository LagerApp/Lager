require 'net/http'
require 'uri'
require 'net/ping'

class App
  get '/' do
    erb :index
  end

  get '/servers' do
    @servers = Server.includes(:services).all;
    content_type :json
    @servers.to_json(:include => :services)
  end

  post '/servers' do
    server_params = params["server"]
    halt(401, "Not authorized") unless server_params
    server = Server.create(host: server_params["host"], label: server_params["label"])
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

  post '/services' do
    services_params = params["services"]
    halt(400, "Services Params missing") unless services_params

    service = Service.create(name: services_params["name"], service_type: services_params["service_type"])
    halt(400, service.errors.to_json) unless service.valid?

    service.servers << services_params["servers"].map do |server_name|
      Server.find_by(host: server_name)
    end
    service.save!
    service.to_json
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

  get '/server/:id/status' do
    server = Server.find(params[:id])
    check = Net::Ping::External.new(server["host"])
    status  = {"status" => check.ping}
    content_type :json
    status.to_json
  end
end

require 'net/http'
require 'uri'
require 'net/ping'

class App
  get '/' do
    erb :index
  end

  get '/servers' do
    @servers = Server.all;
    content_type :json
    @servers.to_json
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
   halt(401, "Not authorized") unless services_params
   services_params["servers"].each do |server_name|
      server = Server.find_by(label: server_name)
      server.services.create(name: services_params["name"], service_type: 'db')
   end
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
    status  = Hash["status" => check.ping]
    content_type :json
    status.to_json
  end
end

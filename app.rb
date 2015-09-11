require 'dotenv'
Dotenv.load

require 'sinatra/base'
require 'sinatra/activerecord'

require 'thin'
require 'em-websocket'
require 'file-tail'

# Can be used in ./lager.rb like Server.find, Service.all etc
require './models/server'
require './models/service'

class App < Sinatra::Base
  configure do
    enable :logging
  end
  set :environment, ENV['RACK_ENV']
  set :public_folder, Proc.new { File.join(root, "public") }
  set :views, Proc.new { File.join(root, "templates") }
  register Sinatra::ActiveRecordExtension

  require "./lib/lager"

  EventMachine.run do
    Thin::Server.start App, '0.0.0.0', 4000
    require "./lib/lager-websocket"
  end
end

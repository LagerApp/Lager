require 'sinatra'
require 'thin'
require 'em-websocket'
require 'file-tail'

EventMachine.run do

  class App < Sinatra::Base
    set :environment, :development
    set :public_folder, Proc.new { File.join(root, "public") }
    set :views, Proc.new { File.join(root, "templates") }
  end

  require "./lib/lager"
  require "./lib/lager-websocket"

  Thin::Server.start App, '0.0.0.0', 4000

end

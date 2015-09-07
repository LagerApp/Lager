require 'sinatra'
require "./lib/sinatra-react"

set :environment, :development
set :public_folder, Proc.new { File.join(root, "public") }
set :views, Proc.new { File.join(root, "templates") }

# Listen on 0.0.0.0
set :bind, '0.0.0.0'
set :port, 4000

Sinatra::Application.run!

class App
  get '/' do
    erb :index
  end

  get '/servers/new' do
    erb :new_server
  end

  get '/log' do
    erb :log
  end
end

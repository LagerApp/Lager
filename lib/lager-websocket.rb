require 'json'

EM::WebSocket.start(:host => "0.0.0.0", :port => 4001) do |ws|
  puts ">> Websocket server started"

  ws.onopen do |handshake|
    puts "WebSocket connection open"
    # Access properties on the EM::WebSocket::Handshake object, e.g.
    # path, query_string, origin, headers
    # Publish message to the client
    l = File::Tail::Logfile.open("/var/log/system.log") 
    l.backward(10)
    l.interval = 1
    Thread.new do
      l.tail do |line|
        puts "Sending line.."
        ws.send({ host: 'host1', msg: line }.to_json)
      end
    end
  end

  ws.onclose { puts "Connection closed" }

  ws.onmessage do |msg|
    puts "Recieved message: #{msg}"
    ws.send "Pong: #{msg}"
  end
end

EM::WebSocket.start(:host => "0.0.0.0", :port => 4001) do |ws|
  puts ">> Websocket server started"

  ws.onopen do |handshake|
    puts "WebSocket connection open"
    # Access properties on the EM::WebSocket::Handshake object, e.g.
    # path, query_string, origin, headers
    # Publish message to the client
    ws.send "Hello Client, you connected to #{handshake.path}"
    Thread.new do
      File::Tail::Logfile.open("/var/log/system.log") do |log|
        log.tail do |line|
          ws.send line
        end
      end
    end
  end

  ws.onclose { puts "Connection closed" }

  ws.onmessage do |msg|
    puts "Recieved message: #{msg}"
    ws.send "Pong: #{msg}"
  end
end

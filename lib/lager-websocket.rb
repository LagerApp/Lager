require 'json'

require_relative 'log_helper'

EM::WebSocket.start(:host => "0.0.0.0", :port => 4001) do |ws|
  puts ">> Websocket server started"

  ws.onopen do |handshake|
    puts "WebSocket connection open"
    # Access properties on the EM::WebSocket::Handshake object, e.g.
    # path, query_string, origin, headers
    # Publish message to the client
    Thread.new do
      stream_log('rahij.com', '/var/log/openvpnas.log') do |ch, success|
        raise "could not stream logs" unless success

        # "on_data" is called when the process writes something to stdout
        ch.on_data do |c, data|
          ws.send({ host: 'rahij.com', msg: data }.to_json)
        end
        ch.on_close { puts "done!" }
      end
    end
  end

  ws.onclose { puts "Connection closed" }

  ws.onmessage do |msg|
    puts "Recieved message: #{msg}"
    ws.send "Pong: #{msg}"
  end
end

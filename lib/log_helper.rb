require 'rubygems'
require 'net/ssh'

SSH_USER = 'ubuntu'

def connect_to_host(host, &block)
  puts "Connecting to #{host}"
  session = Net::SSH.start(host, SSH_USER) do |ssh|
    channel = ssh.open_channel do |ch|
      yield ch
    end
    channel.wait
  end
end

def stream_log(host, logPath, &block)
  connect_to_host(host) do |ch|
    puts "Tailing log file: #{logPath}"
    ch.exec "tail -n 200 -f #{logPath}" do |ch, success|
      yield(ch, success)
    end
  end
end

def generate_fake_log(service, ws)
  msg = { host: service["servers"].sample["host"], msg: { data: "Sample msg for #{service["name"]} - #{Faker::Hacker.say_something_smart}", timestamp: Time.now } }.to_json
  ws.send(msg)
  sleep rand(0..1.0)
end

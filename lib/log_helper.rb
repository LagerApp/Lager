require 'rubygems'
require 'net/ssh'

SSH_USER = 'ubuntu'

def connect_to_host(host, &block)
  session = Net::SSH.start(host, SSH_USER) do |ssh|
    channel = ssh.open_channel do |ch|
      yield ch
    end
    channel.wait
  end
end

def stream_log(host, logPath, &block)
  connect_to_host(host) do |ch|
    ch.exec "tail -f #{logPath}" do |ch, success|
      yield(ch, success)
    end
  end
end
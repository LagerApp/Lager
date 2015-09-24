# Rakefile
require 'dotenv/tasks'

require "sinatra/activerecord/rake"
require "sinatra/base"

require 'yaml'

namespace :db do
  task :load_config do
    # require "./app"
  end

  task :environment => :dotenv do
    current_env = ENV['RACK_ENV']
    db_config = YAML.load_file('config/database.yml')[current_env.to_s]
    ActiveRecord::Base.establish_connection :adapter => db_config["adapter"], :database =>  db_config["database"]
  end

  desc "Migrate the database"
    task(:migrate => :environment) do
      ActiveRecord::Base.logger = Logger.new(STDOUT)
      ActiveRecord::Migration.verbose = true
      ActiveRecord::Migrator.migrate("db/migrate")
   end
end

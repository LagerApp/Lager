echo "Starting setup. Please make sure you have ruby-2.2.2, sqlite3 and bundler installed"
cp config/database.yml.example config/database.yml
echo "RACK_ENV=production" > .env
bundle install
npm install
rake db:migrate

echo "Done"
echo 'Run `ruby app.rb` to start the server. We recommend using Supervisor to run the server in the background.'
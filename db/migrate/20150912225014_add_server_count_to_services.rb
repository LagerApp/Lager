class AddServerCountToServices < ActiveRecord::Migration
  def change
  	add_column :services, :server_count, :integer
  end
end

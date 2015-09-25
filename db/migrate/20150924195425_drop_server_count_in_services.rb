class DropServerCountInServices < ActiveRecord::Migration
  def change
    remove_column :services, :server_count
  end
end

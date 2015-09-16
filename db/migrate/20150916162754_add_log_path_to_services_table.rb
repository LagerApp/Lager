class AddLogPathToServicesTable < ActiveRecord::Migration
  def change
    add_column :services, :log_path, :text
  end
end

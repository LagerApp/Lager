class AddCustomLogPathToServices < ActiveRecord::Migration
  def change
    add_column :services, :log_path, :string
  end
end

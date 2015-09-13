class ChangeIpToLabelInUsers < ActiveRecord::Migration
  def change
    rename_column :servers, :ip, :label
  end
end

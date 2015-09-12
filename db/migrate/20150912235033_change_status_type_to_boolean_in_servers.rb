class ChangeStatusTypeToBooleanInServers < ActiveRecord::Migration
  def change
  	change_column :servers, :status, :boolean
  end
end
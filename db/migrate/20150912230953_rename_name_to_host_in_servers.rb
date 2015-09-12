class RenameNameToHostInServers < ActiveRecord::Migration
  def change
  	rename_column :servers, :name, :host
  end
end
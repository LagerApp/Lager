class CreateServers < ActiveRecord::Migration
  def change
    create_table :servers do |t|
      t.string :ip
      t.string :name
    end
  end
end

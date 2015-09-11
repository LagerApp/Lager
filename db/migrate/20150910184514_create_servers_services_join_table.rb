class CreateServersServicesJoinTable < ActiveRecord::Migration
  def change
    create_table :servers_services, id: false do |t|
      t.belongs_to :server, index: true
      t.belongs_to :service, index: true
    end
  end
end

class Service < ActiveRecord::Base
  has_and_belongs_to_many :servers

  validates_presence_of :name, :service_type, :log_path
end

class Server < ActiveRecord::Base
  has_and_belongs_to_many :services

  validates_presence_of :label, :host
end

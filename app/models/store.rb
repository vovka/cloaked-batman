class Store < ActiveRecord::Base

  # attr_accessible :name, :description, :adress, :telephone, :mail, :contact_person, :map_id

  validates :name, :description, :adress, :telephone, :mail, :contact_person, :map_id, :presence => { 
     :message =>  "%{value} shouldn't be empty" }

   validates :name, :telephone, :mail, :map_id, :contact_person,  uniqueness: true

end

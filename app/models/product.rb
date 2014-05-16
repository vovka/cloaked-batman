class Product < ActiveRecord::Base
  validates :name , presence: true
  validates :price, numericality: { greater_than: 0, allow_nill: true }
end

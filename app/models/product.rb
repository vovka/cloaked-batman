class Product < ActiveRecord::Base
  mount_uploader :image, ImageUploader
  validates :name , presence: true
  validates :price, numericality: { greater_than: 0, allow_nill: true }
  belongs_to :store
end

class Store < ActiveRecord::Base
  has_many :products
	mount_uploader :logo_image, ImageUploader
end

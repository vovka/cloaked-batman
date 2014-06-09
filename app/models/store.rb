class Store < ActiveRecord::Base
	mount_uploader :logo_image, ImageUploader
end

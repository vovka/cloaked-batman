class Shape < ActiveRecord::Base
  mount_uploader :image, ImageUploader
end

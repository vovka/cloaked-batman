class AddImageToStore < ActiveRecord::Migration
  def change
    add_column :stores, :logo_image, :string
  end
end

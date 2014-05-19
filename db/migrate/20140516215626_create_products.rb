class CreateProducts < ActiveRecord::Migration
  def up
    create_table :products do |t|
      t.integer "store_id" #For association with Store model(table)
      t.string :name
      t.float   :price, limit: 6
      t.text :side_description
      t.text :description
      t.boolean :visible, :default => true
      t.boolean :availability, :default => true

      t.timestamps
      #Other column(image and maybe someone else for images) i add later when carrierwave gem will be installed
    end
    #Feature for search
    add_index :products, :price
    add_index :products, :name
  end

  def down
    drop_table :products
  end
end

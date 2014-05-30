class CreateShapes < ActiveRecord::Migration
  def change
    create_table :shapes do |t|
      t.string :shape_type
      t.string :coordinates
      t.string :image
      t.text :description
      t.timestamps
    end
  end
  
  def down
    drop_table :shapes
  end
end

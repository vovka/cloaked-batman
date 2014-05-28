class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.string :name
      t.string :description
      t.string :adress
      t.string :telephone
      t.string :mail
      t.string :contact_person
      t.integer :map_id

      t.timestamps
    end
  end
end

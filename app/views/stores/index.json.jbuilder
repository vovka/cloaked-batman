json.array!(@stores) do |store|
  json.extract! store, :id, :name, :description, :adress, :telephone, :mail, :contact_person, :map_id
  json.url store_url(store, format: :json)
end

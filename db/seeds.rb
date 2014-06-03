# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


#Shapes
Shape.create(shape_type: "polygon", coordinates: "chslH{rpcD?eDd@yAXdF", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, ipsum aspernatur officia suscipit rem consectetur.")
Shape.create(shape_type: "rectangle", coordinates: "_eslHu}ocDsCsH", description: "Some shape description")
Shape.create(shape_type: "rectangle", coordinates: "q|rlHuhpcDgEoF", description: "This is polygon and some one else...")

#Products
Product.create(name: "Razer Abyssus Gaming Mouse", price: 434.0,side_description: "Мышь Razer Abyssus предназначена для геймеров, кот...",description: "Мышь Razer Abyssus предназначена для геймеров", image: "razer-abyssus-03.jpg")
Product.create(name: "Razer Kraken Pro", price: 1078.0,side_description: "Kraken Pro обеспечивает сочный и насыщенный звук",description: "Kraken Pro обеспечивает сочный и насыщенный звук в", image: "razerkrakenpro01.jpg")

#Stores
Store.create(name: "Orlando Shop", description: "Supermarket Orlando Shop", adress: "Lviv, Paternaka,5", telephone: "+380979379992", mail: "mail@mail.com", contact_person: "Oleksiy Pastukhov", map_id: 1)
Store.create(name: "Bruklin Shop", description: "Supermarket Bruklin Shop", adress: "Lviv, Fedkovycha,20", telephone: "+380979379992", mail: "mail@mail.com", contact_person: "Taras Shyika", map_id: 2)
Store.create(name: "Texas Shop", description: "Supermarket Texas Shop", adress: "Lviv, V.Velykogo,63", telephone: "+380979379992", mail: "mail@mail.com", contact_person: "Severyn Rybchynsky", map_id: 3)
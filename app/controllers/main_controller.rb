class MainController < ApplicationController
  def index
    @products = Product.all
    @stores = Store.all
    @products.all.map{|p| p.attributes}
  end
end

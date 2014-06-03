class MainController < ApplicationController
  def index
    @products = Product.all
    @stores = Store.all
  end
end

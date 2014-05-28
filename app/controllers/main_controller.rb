class MainController < ApplicationController
  def index
    @products = Product.all
  end
end

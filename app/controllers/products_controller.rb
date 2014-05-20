class ProductsController < ApplicationController
  before_filter :find_product, only: [:show]

  def index
    @products = Product.all
  end

  def create
  end

  def update
  end

  def destroy
    @product.destroy
    redirect_to action: "index"
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @product = Product.new
  end
  
  def edit
  end
  
  private

    def product_params
      params.require(:product).permit!
    end

    def find_product
      @product = Product.where(id: params[:id]).first
      unless @product
        render :text => "Page not found", :status => 404
      end
    end
end

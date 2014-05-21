class ProductsController < ApplicationController
  before_filter :find_product, only: [:show, :update, :destroy, :edit]

  def index
    @products = Product.all
  end

  def create
    # render :text => params.inspect
    @product = Product.create(product_params)
    # @product.images << product[:image]
    if @product.errors.empty?
      redirect_to(:action => 'index')
    else
      render "new"
    end
  end

  def update
    @product.update_attributes(product_params)
    if @product.errors.empty?
      redirect_to product_path(@product)
    else
      render "edit"
    end
  end

  def destroy
    @product.remove_image! if @product.image?
    @product.destroy
    redirect_to action: "index"
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @product = Product.new()
  end
  
  def edit
  end
  
  private

    def product_params
      params.require(:product).permit(:name, :price, :image, :description, :side_description, :visible, :availability)
    end

    def find_product
      @product = Product.where(id: params[:id]).first
      unless @product
        render :text => "Page not found", :status => 404
      end
    end
end

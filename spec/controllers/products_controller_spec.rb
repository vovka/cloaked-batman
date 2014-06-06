require 'spec_helper'

describe ProductsController do
  describe "show action" do
    it "render show template if item is found" do
      product = FactoryGirl.create(:product)
      get :show, {id: 1, store_id: product.store}
      expect(response).to render_template('show')
    end
    it "render 404 page if an item is not found" do 
      get :show, {id: 32, store_id: 43}
      expect(response.status).to eq(404)
    end
  end
end
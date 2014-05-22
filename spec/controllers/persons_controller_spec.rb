require 'spec_helper'

describe PersonsController do

  describe "GET 'profile'" do
    it "returns http success" do
      get 'profile'
      expect(response).to be_success
    end
  end

end

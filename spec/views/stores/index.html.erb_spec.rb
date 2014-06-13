require 'spec_helper'

describe "stores/index" do
  before(:each) do
    assign(:stores, [
      stub_model(Store,
        :name => "Name",
        :description => "Description",
        :adress => "Adress",
        :telephone => "Telephone",
        :mail => "Mail",
        :contact_person => "Contact Person",
        :map_id => 1
      ),
      stub_model(Store,
        :name => "Name",
        :description => "Description",
        :adress => "Adress",
        :telephone => "Telephone",
        :mail => "Mail",
        :contact_person => "Contact Person",
        :map_id => 1
      )
    ])
  end

  it "renders a list of stores" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
#    assert_select "tr>td", :text => "Description".to_s, :count => 2
    assert_select "tr>td", :text => "Adress".to_s, :count => 2
    assert_select "tr>td", :text => "Telephone".to_s, :count => 2
    assert_select "tr>td", :text => "Mail".to_s, :count => 2
    assert_select "tr>td", :text => "Contact Person".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
  end
end

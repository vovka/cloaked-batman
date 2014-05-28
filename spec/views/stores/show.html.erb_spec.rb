require 'spec_helper'

describe "stores/show" do
  before(:each) do
    @store = assign(:store, stub_model(Store,
      :name => "Name",
#      :description => "Description",
      :adress => "Adress",
      :telephone => "Telephone",
      :mail => "Mail",
      :contact_person => "Contact Person",
      :map_id => 1
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
#    expect(rendered).to match(/Description/)
    expect(rendered).to match(/Adress/)
    expect(rendered).to match(/Telephone/)
    expect(rendered).to match(/Mail/)
    expect(rendered).to match(/Contact Person/)
    expect(rendered).to match(/1/)
  end
end

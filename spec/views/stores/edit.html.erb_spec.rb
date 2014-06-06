require 'spec_helper'

describe "stores/edit" do
  before(:each) do
    @store = assign(:store, stub_model(Store,
      :name => "MyString",
      :description => "MyString",
      :adress => "MyString",
      :telephone => "MyString",
      :mail => "MyString",
      :contact_person => "MyString",
      :map_id => 1
    ))
  end

  it "renders the edit store form" do
    render

    assert_select "form[action=?][method=?]", stores_path(@store), "post" do
      assert_select "input#store_name[name=?]", "store[name]"
      assert_select "textarea#store_description[name=?]", "store[description]"
      assert_select "input#store_adress[name=?]", "store[adress]"
      assert_select "input#store_telephone[name=?]", "store[telephone]"
      assert_select "input#store_mail[name=?]", "store[mail]"
      assert_select "input#store_contact_person[name=?]", "store[contact_person]"
      assert_select "input#store_map_id[name=?]", "store[map_id]"
    end
  end
end

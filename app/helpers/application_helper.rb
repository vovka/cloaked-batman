module ApplicationHelper
  def put_active_class(id_li)
    params[:controller] == id_li ? 'class="active"' : 'class=""'
  end
end

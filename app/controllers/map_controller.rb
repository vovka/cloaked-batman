class MapController < ApplicationController

  skip_before_filter :verify_authenticity_token, :only => [:create_shape]

  def index
    @shapes = Shape.all
    respond_to do |format|
      format.html 
      format.json { render json: @shapes }
    end
  end

  def create_shape_upload
    shape_obj = Array.new
    shape_obj = params[:shape].split('||', 2);
    shape = Shape.new(shape_type: shape_obj[0], coordinates: shape_obj[1], description:params[:map][:description], image: params[:map][:image])
    respond_to do |f|
      f.html {
        redirect_to(:action => 'index') if shape.save
      }
    end
  end

  private

    def shape_params
      params.require(:shape).permit!
    end

end

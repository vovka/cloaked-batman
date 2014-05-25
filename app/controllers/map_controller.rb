class MapController < ApplicationController

  skip_before_filter :verify_authenticity_token, :only => [:create_shape]

  def index
    @shapes = Shape.all
    respond_to do |format|
      format.html 
      format.json { render json: @shapes }
    end
  end

  def create_shape
    shape = Shape.new(shape_type: params[:shapeType], coordinates: params[:shapeCoord], description: params[:shapeDescription])
    respond_to do |f|
      f.json {
        if shape.save
          render :text => 'Success'
        else
          render :text => 'Error'
        end
      }
    end
  end
end

class CommentsController < ApplicationController
  before_action :set_comment, only: %i[ edit update destroy ]
  skip_before_action :authorized, only: %i[ index show ]

  # GET /comments or /comments.json
  def index
    @comments = Comment.all
  end

  # GET /comments/1 or /comments/1.json
  def show
    parsed_query = Rack::Utils.parse_nested_query params[:id]
    has_post_id = parsed_query.include?("post_id")    
    has_user_id = parsed_query.include?("user_id")    

    if has_post_id and has_user_id
      @comments = Comment.where("post_id = ? AND user_id = ?", parsed_query["post_id"], parsed_query["user_id"])
    elsif has_post_id
      @comments = Comment.where("post_id = ?", parsed_query["post_id"])
    elsif has_user_id
      @comments = Comment.where("user_id = ?", parsed_query["user_id"])
    else
      render json: {error: "Invalid query"}
    end
      
    render json: @comments
  end

  # GET /comments/new
  def new
    @comment = Comment.new
  end

  # GET /comments/1/edit
  def edit
  end

  # POST /comments or /comments.json
  def create
    @comment = Comment.new(comment_params)

    respond_to do |format|
      if @comment.save
        format.html { redirect_to comment_url(@comment), notice: "Comment was successfully created." }
        format.json { render :show, status: :created, location: @comment }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /comments/1 or /comments/1.json
  def update
    respond_to do |format|
      if @comment.update(comment_params)
        format.html { redirect_to comment_url(@comment), notice: "Comment was successfully updated." }
        format.json { render :show, status: :ok, location: @comment }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /comments/1 or /comments/1.json
  def destroy
    @comment.destroy

    respond_to do |format|
      format.html { redirect_to comments_url, notice: "Comment was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def comment_params
      params.require(:comment).permit(:body, :rating, :post_id, :user_id)
    end
end

class CommentsController < ApplicationController
  before_action :set_comment, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token
  skip_before_action :authorized, only: %i[ index show ]

  # GET /comments or /comments.json
  def index
    @comments = Comment.all
              .joins(:user)
              .select("comments.*", "username")
              .as_json()
    render json: @comments, status: :ok
  end

  # GET /comments/1 or /comments/1.json
  def show
    parsed_query = Rack::Utils.parse_nested_query params[:id]
    has_post_id = parsed_query.include?("post_id")
    has_user_id = parsed_query.include?("user_id")
    post_id = parsed_query["post_id"]
    user_id = parsed_query["user_id"]
    
    if has_post_id and has_user_id
      @comments = Comment.where("comments.post_id = ? AND comments.user_id = ?", post_id, user_id)
                          .joins(:user)
                          .select("comments.*", "username")
                          .as_json()
    elsif has_post_id
      @comments = Comment.where("comments.post_id = ?", post_id)
                          .joins(:user)
                          .select("comments.*", "username")
                          .as_json()
    elsif has_user_id
      @comments = Comment.where("comments.user_id = ?", user_id)
                          .joins(:user)
                          .select("comments.*", "username")
                          .as_json()
    else
      render json: {error: "Invalid query"}, status: :unprocessable_entity
      return
    end

    render json: @comments, status: :ok
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
      if @user.id == @comment.user_id
        if @comment.save
          data = Comment.where("comments.id = ?", @comment.id)
                        .joins(:user)
                        .select("comments.*", "username")
                        .as_json()
          format.json { render json: data, status: :created }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @comment.errors, status: :unprocessable_entity }
        end
      else
        format.json { render json: @comment, status: :unauthorized }
      end
    end
  end

  # PATCH/PUT /comments/1 or /comments/1.json
  def update
    respond_to do |format|
      if @user.id == @comment.user_id
        if @comment.update(comment_params)
          data = Comment.where("comments.id = ?", @comment.id)
                        .joins(:user)
                        .select("comments.*", "username")
                        .as_json()
          format.json { render json: data, status: :ok }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @comment.errors, status: :unprocessable_entity }
        end
      else
        format.json { render json: @comment, status: :unauthorized }
      end
    end
  end

  # DELETE /comments/1 or /comments/1.json
  def destroy
    post_id = @comment.post_id

    respond_to do |format|
      if @user.id == @comment.user_id
        @comment.destroy
        format.html { redirect_to comments_url, notice: "Comment was successfully destroyed." }
        format.json { render json: Comment.where("post_id = ?", post_id)}
      else
        format.json { render json: Comment.where("post_id = ?", post_id), status: :unauthorized }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def comment_params
      params.require(:comment).permit(:body, :rating, :post_id, :user_id, :username)
    end
end

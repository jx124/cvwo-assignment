class PostsController < ApplicationController
  before_action :set_post, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token
  skip_before_action :authorized, only: %i[ index show ]

  # GET /posts or /posts.json
  def index
    @posts = Post.all
  end

  # GET /posts/1 or /posts/1.json
  def show
    parsed_query = Rack::Utils.parse_nested_query params[:id]
    has_post_id = parsed_query.include?("post_id")    
    has_user_id = parsed_query.include?("user_id")    

    if has_post_id and has_user_id
      @posts = Post.where("id = ? AND user_id = ?", parsed_query["post_id"], parsed_query["user_id"])
    elsif has_post_id
      @posts = Post.where("id = ?", parsed_query["post_id"])
    elsif has_user_id
      @posts = Post.where("user_id = ?", parsed_query["user_id"])
    else
      render json: {error: "Invalid query"}
    end
      
    render json: @posts
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts or /posts.json
  def create
    @post = Post.new(post_params)
    @post.user_id = @user.id

    respond_to do |format|
      if @post.save
        format.html { redirect_to post_url(@post), notice: "Post was successfully created." }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1 or /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to post_url(@post), notice: "Post was successfully updated." }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1 or /posts/1.json
  def destroy
    respond_to do |format|
      if @user.id == @post.user_id
        @post.destroy
        format.html { redirect_to posts_url, notice: "Post was successfully destroyed." }
        format.json { render json: Post.all, status: :ok }
      else
        format.html { redirect_to posts_url, notice: "User does not have permission to delete post." }
        format.json { render json: Post.all, status: :unauthorized}
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :body, {:tags => []}, :rating, :user_id)
    end
end

class UsersController < ApplicationController
  before_action :authorized, only: [:auto_login]
  skip_before_action :verify_authenticity_token

  # REGISTER
  def create
    @user = User.find_by(username: params[:username])
    if @user
      puts "User found: #@user"
      render json: {error: "Username already exists"}
    else
      @user = User.create(user_params)
      if @user.valid?
        token = encode_token({user_id: @user.id})
        render json: {user: @user, token: token}
      else
        render json: {error: "Invalid username or password"}
      end
    end
  end

  # LOGGING IN
  def login
    @user = User.find_by(username: params[:username])

    if @user && @user.authenticate(params[:password])
      token = encode_token({user_id: @user.id})
      render json: {user: @user, token: token}
    else
      render json: {error: "Invalid username or password"}
    end
  end


  def auto_login
    render json: @user
  end

  private

  def user_params
    params.permit(:username, :password, :age)
  end

end

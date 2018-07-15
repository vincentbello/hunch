class UsersController < ApplicationController
  def index
    users = User.all
    render json: users
  end

  def facebook_auth
    @graph = Koala::Facebook::API.new(params[:token])
    profile = @graph.get_object("me?fields=email,first_name,last_name,gender")
    user = User.find_by(fb_id: profile['id'])

    if user.present?
      user.login_count += 1
    else
      user = User.new(
        fb_id: profile['id'],
        email: profile['email'],
        first_name: profile['first_name'],
        last_name: profile['last_name'],
        gender: profile['gender'],
        active: true,
        is_admin: false,
        login_count: 1
      )
    end

    user.save!
    render json: user
  end
end

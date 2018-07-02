class User < ApplicationRecord
  has_many :created_bets,  class_name: "Bet", foreign_key: "bettor_id"
  has_many :assigned_bets, class_name: "Bet", foreign_key: "bettee_id"
  has_many :won_bets, class_name: "Bet", foreign_key: "winner_id"

  def self.create_with_omniauth(auth)
    user = find_or_create_by(uid: auth['uid'], provider: auth['provider'])
    user.email = auth['info']['email']
    user.password = auth['uid']
    user.first_name = auth['info']['first_name']
    user.last_name = auth['info']['last_name']
    user.fb_id = auth['info']['id']
    user.image_url = auth['info']['picture']

    if User.exists?(user)
      user
    else
      user.save!
      user
    end
  end
end

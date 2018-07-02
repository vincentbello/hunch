class User < ApplicationRecord
  has_many :created_bets,  class_name: "Bet", foreign_key: "bettor_id"
  has_many :assigned_bets, class_name: "Bet", foreign_key: "bettee_id"
  has_many :won_bets, class_name: "Bet", foreign_key: "winner_id"
end

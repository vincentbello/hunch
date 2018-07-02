class Bet < ApplicationRecord
  belongs_to :bettor, class_name: "User", foreign_key: "bettor_id"
  belongs_to :bettee, class_name: "User", foreign_key: "bettee_id"
  belongs_to :winner, class_name: "User", foreign_key: "winner_id"

  belongs_to :game
end

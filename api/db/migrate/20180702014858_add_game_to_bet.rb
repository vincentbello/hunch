class AddGameToBet < ActiveRecord::Migration[5.0]
  def change
    add_reference :bets, :game, foreign_key: true
  end
end

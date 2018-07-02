class AddWinnerToBet < ActiveRecord::Migration[5.0]
  def change
    add_reference :bets, :winner, index: true
    add_foreign_key :bets, :users, column: :winner_id
  end
end

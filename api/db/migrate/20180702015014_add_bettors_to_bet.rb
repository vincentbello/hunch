class AddBettorsToBet < ActiveRecord::Migration[5.0]
  def change
    add_reference :bets, :bettor, index: true
    add_foreign_key :bets, :users, column: :bettor_id

    add_reference :bets, :bettee, index: true
    add_foreign_key :bets, :users, column: :bettee_id
  end
end

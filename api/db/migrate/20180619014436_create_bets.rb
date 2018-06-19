class CreateBets < ActiveRecord::Migration[5.0]
  def change
    create_table :bets do |t|
      t.string :bet_type
      t.integer :amount
      t.string :wager
      t.boolean :active
      t.datetime :created_at
      t.datetime :resolved_at

      t.timestamps
    end
  end
end

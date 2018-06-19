class AddFieldnameToBet < ActiveRecord::Migration[5.0]
  def change
    # add_reference :bets, :bettor, index: true
    # add_foreign_keyadd_column :bets, :bettee_id, :integer
    # add_column :bets, :game_id, :integer

    # add_index :bets, :game_id

    # add_column :games, :home_team_id, :integer
    # add_column :games, :away_team_id, :integer
  end
end

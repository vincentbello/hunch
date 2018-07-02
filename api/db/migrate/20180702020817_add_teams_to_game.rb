class AddTeamsToGame < ActiveRecord::Migration[5.0]
  def change
    add_reference :games, :home_team, index: true
    add_foreign_key :games, :teams, column: :home_team_id

    add_reference :games, :away_team, index: true
    add_foreign_key :games, :teams, column: :away_team_id
  end
end

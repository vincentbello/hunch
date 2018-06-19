class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.integer :number
      t.string :league
      t.integer :season
      t.string :season_type
      t.boolean :completed
      t.integer :home_score
      t.integer :away_score
      t.integer :week
      t.datetime :start_date

      t.timestamps
    end
  end
end

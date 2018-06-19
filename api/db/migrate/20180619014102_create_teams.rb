class CreateTeams < ActiveRecord::Migration[5.0]
  def change
    create_table :teams do |t|
      t.string :abbreviation
      t.string :first_name
      t.string :last_name
      t.string :league
      t.string :conference
      t.string :division

      t.timestamps
    end
  end
end

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180715225332) do

  create_table "bets", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "bet_type"
    t.integer  "amount"
    t.string   "wager"
    t.boolean  "active"
    t.datetime "created_at",  null: false
    t.datetime "resolved_at"
    t.datetime "updated_at",  null: false
    t.integer  "game_id"
    t.integer  "bettor_id"
    t.integer  "bettee_id"
    t.integer  "winner_id"
    t.index ["bettee_id"], name: "index_bets_on_bettee_id", using: :btree
    t.index ["bettor_id"], name: "index_bets_on_bettor_id", using: :btree
    t.index ["game_id"], name: "index_bets_on_game_id", using: :btree
    t.index ["winner_id"], name: "index_bets_on_winner_id", using: :btree
  end

  create_table "games", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "number"
    t.string   "league"
    t.integer  "season"
    t.string   "season_type"
    t.boolean  "completed"
    t.integer  "home_score"
    t.integer  "away_score"
    t.integer  "week"
    t.datetime "start_date"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "home_team_id"
    t.integer  "away_team_id"
    t.index ["away_team_id"], name: "index_games_on_away_team_id", using: :btree
    t.index ["home_team_id"], name: "index_games_on_home_team_id", using: :btree
  end

  create_table "teams", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "abbreviation"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "league"
    t.string   "conference"
    t.string   "division"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "email"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "first_name"
    t.string   "last_name"
    t.boolean  "active"
    t.boolean  "is_admin"
    t.string   "fb_id"
    t.string   "image_url"
    t.string   "gender"
    t.datetime "last_login_at"
    t.datetime "current_login_at"
    t.integer  "login_count"
  end

  add_foreign_key "bets", "games"
  add_foreign_key "bets", "users", column: "bettee_id"
  add_foreign_key "bets", "users", column: "bettor_id"
  add_foreign_key "bets", "users", column: "winner_id"
  add_foreign_key "games", "teams", column: "away_team_id"
  add_foreign_key "games", "teams", column: "home_team_id"
end

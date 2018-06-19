class AddFieldnameToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :fb_id, :string
    add_column :users, :image_url, :string
    add_column :users, :gender, :string
    add_column :users, :last_login_at, :datetime
    add_column :users, :current_login_at, :datetime
    add_column :users, :login_count, :integer
  end
end

class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.integer :id, null: false
      t.string :title, null: false
      t.text :body, null: false
      t.string :tags, null: false, array: true, default: []
      t.integer :rating, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

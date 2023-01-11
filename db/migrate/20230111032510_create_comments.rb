class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      # t.integer :id, null: false
      t.text :body, null: false
      t.integer :rating, null: false
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

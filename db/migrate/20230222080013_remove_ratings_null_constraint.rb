class RemoveRatingsNullConstraint < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :rating, :true
    change_column_null :comments, :rating, :true
  end
end

class User < ApplicationRecord
    has_secure_password

    validates :username, presence: true, uniqueness: true
    validates :password, presence: true

    has_many :post, dependent: :destroy
    has_many :comment, dependent: :destroy
end

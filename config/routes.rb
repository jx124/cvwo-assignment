Rails.application.routes.draw do
  resources :comments
  resources :posts
  resources :users, only: [:create]

  root "posts#index"
  post "/login", to: "users#login"
  get "/auto_login", to: "users#auto_login"
end

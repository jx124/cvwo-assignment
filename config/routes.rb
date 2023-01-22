Rails.application.routes.draw do
  resources :posts do
    resources :comments
  end
  resources :users, only: [:create]

  root "posts#index"
  get "/posts/:id", to: "posts#show"
  get "/comments/:id", to: "comments#show"
  post "/comments", to: "comments#create"
  post "/login", to: "users#login"
  post "/signup", to: "users#create"
  get "/auto_login", to: "users#auto_login"
end

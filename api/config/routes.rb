Rails.application.routes.draw do
  root to: 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  scope '/api' do
    resources :users do
      collection do
        post 'facebook_auth'
      end
    end
  end
end

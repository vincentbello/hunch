Koala.configure do |config|
  # config.access_token = MY_TOKEN
  # config.app_access_token = MY_APP_ACCESS_TOKEN
  config.app_id = Rails.application.secrets.facebook_app_id
  config.app_secret = Rails.application.secrets.facebook_app_secret
  # See Koala::Configuration for more options, including details on how to send requests through
  # your own proxy servers.
end

# -OmniAuth.config.logger = Rails.logger
# -
# -Rails.application.config.middleware.use OmniAuth::Builder do
# -  provider :facebook, Rails.application.secrets.facebook_app_id,
# -  Rails.application.secrets.facebook_app_secret, scope: 'public_profile', info_fields: 'id,email,first_name,last_name,picture'
# -end

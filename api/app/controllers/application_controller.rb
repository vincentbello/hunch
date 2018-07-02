class ApplicationController < ActionController::API
  # Render a response containing an error message and status in a predictable JSON format
  # http://billpatrianakos.me/blog/2013/10/13/list-of-rails-status-code-symbols/
  def render_error_response(error_message = 'An error occurred.', status_code: :not_implemented, meta: nil)
    render status: status_code, json: {
      message: error_message,
      status: Rack::Utils::SYMBOL_TO_STATUS_CODE[status_code],
      meta: meta
    }
  end
end

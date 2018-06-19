class UserSerializer < ActiveModel::Serializer
  attributes :id, :active, :email, :is_admin, :name

  def name
    "#{object.first_name} #{object.last_name}"
  end
end

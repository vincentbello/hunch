class UserSerializer < ActiveModel::Serializer
  attributes :id, :active, :email, :is_admin, :full_name

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end

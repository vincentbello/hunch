const READABLE_GENDERS = {
  F: 'Female',
  M: 'Male',
};

export default class UserSerializer {
  constructor(user) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.email = user.email;
    this.lastName = user.lastName;
    this.active = user.active;
    this.admin = user.admin;
    this.fbId = user.fbId;
    this.imageUrl = user.imageUrl;
    this.gender = user.gender;
    this.lastLoginAt = user.lastLoginAt;
    this.currentLoginAt = user.currentLoginAt;
    this.loginCount = user.loginCount;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get readableGender() {
    return READABLE_GENDERS[this.gender]
  }

  serialize() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      active: this.active,
      admin: this.admin,
      imageUrl: this.imageUrl,
      gender: this.readableGender,
    };
  };
}

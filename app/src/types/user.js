// @flow
export type User = {
  id: number,
  firstName: string,
  lastName: string,
  fullName: string,
  imageUrl: null | string,
  fbId: string,
  lastLoginAt: string,
  createdAt: string,
};

export type UserGroupType = 'friends';

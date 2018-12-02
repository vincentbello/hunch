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
  friendCount: number,
};

export type FriendshipStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'DELETED';

export type FriendshipSource = 'APP' | 'FB';

export type UserFriendship = {
  userId: number,
  friendId: number,
  status: FriendshipStatus,
  source: FriendshipSource,
};

export type StatGroup = {
  won: number,
  played: number,
  amountWon: number,
  amountLost: number,
};

export type UserStats = {
  overall: StatGroup,
  against: StatGroup,
};

export type UserListType = 'FRIENDS' | 'FRIEND_REQUESTS';

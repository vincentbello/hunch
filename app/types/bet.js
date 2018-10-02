// @flow
export type Bet = {
  id: number,
  responded: boolean,
  accepted: boolean,
  active: boolean,
  amount: number,
  resolvedAt: string,
  type: 'MONEY_LINE',
  wager: string,
  createdAt: string,
};

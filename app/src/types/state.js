// @flow
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';
import { type ReduxState as BetListsState } from 'reducers/views/betLists';
import { type ReduxState as CreateBetState } from 'reducers/views/createBet';

export type ReduxState = {
  session: SessionState,
  user: UserState,
  views: {
    betLists: BetListsState,
    createBet: CreateBetState,
  },
};

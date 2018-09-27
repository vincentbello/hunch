// @flow
import { type BetEntities } from 'types/entities';
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';
import { type ReduxState as BetListsState } from 'reducers/views/betLists';

export type ReduxState = {
  entities: {
    bets: BetEntities,
  },
  session: SessionState,
  user: UserState,
  views: {
    betLists: BetListsState,
  },
};

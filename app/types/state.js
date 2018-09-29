// @flow
import { type Entities } from 'types/entities';
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';
import { type ReduxState as BetCardState } from 'reducers/views/betCard';
import { type ReduxState as BetListsState } from 'reducers/views/betLists';

export type ReduxState = {
  entities: Entities,
  session: SessionState,
  user: UserState,
  views: {
    betCard: BetCardState,
    betLists: BetListsState,
  },
};

// @flow
import { type AllEntities } from 'types/entities';
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';
import { type ReduxState as BetCardState } from 'reducers/views/betCard';
import { type ReduxState as BetListsState } from 'reducers/views/betLists';
import { type ReduxState as CreateBetState } from 'reducers/views/createBet';

export type ReduxState = {
  entities: AllEntities,
  session: SessionState,
  user: UserState,
  views: {
    betCard: BetCardState,
    betLists: BetListsState,
    createBet: CreateBetState,
  },
};

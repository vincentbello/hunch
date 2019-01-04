// @flow
import { type ReduxState as SessionState } from 'reducers/session';
import { type ReduxState as UserState } from 'reducers/user';
import { type ReduxState as HunchListsState } from 'reducers/views/hunchLists';
import { type ReduxState as CreateHunchState } from 'reducers/views/createHunch';

export type ReduxState = {
  session: SessionState,
  user: UserState,
  views: {
    hunchLists: HunchListsState,
    createHunch: CreateHunchState,
  },
};

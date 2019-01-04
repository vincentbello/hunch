// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { HUNCH_VIEW_TYPES } from 'constants/view-types';
import { getViewIndex, getHunchListType } from 'selectors/hunches';
import { setViewIndex } from 'actions/hunches';
import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';

import { type HunchListType } from 'types/hunch';
import { type Action } from 'types/redux';
import { type ReduxState } from 'types/state';

import HunchList from 'components/HunchList';
import TabView from 'components/TabView';

type ReduxProps = {
  hunchListType: HunchListType,
  viewIndex: number,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  hunchListType: getHunchListType(state),
  viewIndex: getViewIndex(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ setViewIndex }, dispatch),
  },
});

type Props = ReduxProps & CurrentUserProps & {
  actions: {
    setViewIndex: (viewIndex: number) => void,
  },
};

function HunchesContainer({ actions, hunchListType, currentUser, viewIndex }: Props): React.Node {
  return (
    <TabView
      navigationState={{
        index: viewIndex,
        routes: HUNCH_VIEW_TYPES,
      }}
      onIndexChange={actions.setViewIndex}
      renderScene={(): React.Node => <HunchList hunchListType={hunchListType} user={currentUser} />}
    />
  );
}
HunchesContainer.displayName = 'HunchesContainer';

export default withCurrentUser(connect(mapStateToProps, mapDispatchToProps)(HunchesContainer));

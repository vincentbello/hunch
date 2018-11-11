// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import GET_BETS from 'graphql/queries/getBets';

import { type Error } from 'types/apollo';
import { type Bet, type BetListType } from 'types/bet';
import { type User } from 'types/user';

import BetCell from 'components/BetCell';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Splash from 'components/Splash';

type Props = {
  betsQuery: {
    loading: boolean,
    error: Error,
    data: Array<Bet>,
    networkStatus: number,
    refetch: () => void,
  },
  betListType: BetListType,
  user: User,
};

function BetList({ betsQuery: { bets, error, loading, networkStatus, refetch }, betListType, user }: Props): React.Node {
  const renderBets = (bets: Array<Bet>): React.Node => {
    if (bets.length === 0) return <Splash heading={`You have no ${betListType} bets.`} iconName="slash" />;
    return (
      <FlatList
        data={bets}
        keyExtractor={(bet: Bet): string => `${bet.id}`}
        onRefresh={refetch}
        refreshing={networkStatus === 4}
        renderItem={({ item, index }): React.Node => (
          <BetCell
            bet={item}
            userId={user.id}
            onPress={(): void => Actions.betCard({ betId: item.id })}
          />
        )}
      />
    );
  };

  return (
    <DerivedStateSplash error={error} loading={loading} withCachedData={Boolean(bets)}>
      {Boolean(bets) && renderBets(bets)}
    </DerivedStateSplash>
  );
}
BetList.displayName = 'BetList';

export default graphql(GET_BETS, {
  name: 'betsQuery',
  options: ({ betListType }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { betListType },
  }),
})(BetList);

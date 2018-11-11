// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { AsyncStorage, FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import GET_BETS from 'graphql/queries/getBets';

import { type Error } from 'types/apollo';
import { type Bet } from 'types/bet';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

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

function BetList({ betsQuery, betListType, user }: Props) {
  const renderBets = (bets: Array<Bet>): React.Node => {
    console.log('RENDER BETS', bets);
    if (bets.length === 0) return <Splash heading={`You have no ${betListType} bets.`} iconName="slash" />;
    return (
      <FlatList
        data={bets}
        keyExtractor={(bet: Bet): string => `${bet.id}`}
        onRefresh={betsQuery.refetch}
        refreshing={betsQuery.networkStatus === 4}
        renderItem={({ item, index }): React.Node => (
          <BetCell
            bet={item}
            userId={user.id}
            onPress={(): void => Actions.betCard({ betId: item.id })}
            cancelRequest={(): void => {/** TODO actions.cancelRequest(item.id, index) */}}
          />
        )}
      />
    );
  };

  return (
    <DerivedStateSplash error={betsQuery.error} loading={betsQuery.loading} withCachedData={Boolean(betsQuery.bets)}>
      {Boolean(betsQuery.bets) && renderBets(betsQuery.bets)}
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

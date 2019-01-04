// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import GET_HUNCHES from 'graphql/queries/getHunches';

import { type Error } from 'types/apollo';
import { type Hunch, type HunchListType } from 'types/hunch';
import { type User } from 'types/user';

import Colors from 'theme/colors';

import Icon from 'react-native-vector-icons/Feather';
import HunchCell from 'components/HunchCell';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Splash from 'components/Splash';

type Props = {
  hunchesQuery: {
    loading: boolean,
    error: Error,
    data: Array<Hunch>,
    networkStatus: number,
    refetch: () => void,
  },
  hunchListType: HunchListType,
  user: User,
};

const styles = StyleSheet.create({
  subheadIcon: {
    marginRight: 6,
  },
  subheadText: {
    fontWeight: '600',
    color: Colors.brand.primary,
    fontSize: 18,
  },
});

function HunchList({ hunchesQuery: { hunches, error, loading, networkStatus, refetch }, hunchListType, user }: Props): React.Node {
  const renderHunches = (hunches: Array<Hunch>): React.Node => {
    if (hunches.length === 0) {
      return (
        <Splash
          heading={`You have no ${hunchListType.toLowerCase()} hunches.`}
          inTabs
          visualName="MEH_LIGHTBULB"
          visualType="illustration"
          renderSubhead={hunchListType === 'ACTIVE' ? (): React.Node => (
            <Icon.Button
              backgroundColor={Colors.transparent}
              color={Colors.brand.primary}
              iconStyle={styles.subheadIcon}
              name="plus"
              underlayColor={Colors.background}
              onPress={Actions.createHunchModal}
            >
              <Text style={styles.subheadText}>Create One</Text>
            </Icon.Button>
          ) : null}
        />
      );
    }

    return (
      <FlatList
        data={hunches}
        keyExtractor={(hunch: Hunch): string => `${hunch.id}`}
        onRefresh={refetch}
        refreshing={networkStatus === 4}
        renderItem={({ item, index }): React.Node => (
          <HunchCell
            hunch={item}
            userId={user.id}
            onPress={(): void => Actions.hunchCard({ hunchId: item.id })}
          />
        )}
      />
    );
  };

  return (
    <DerivedStateSplash error={error} loading={loading} withCachedData={Boolean(hunches)}>
      {Boolean(hunches) && renderHunches(hunches)}
    </DerivedStateSplash>
  );
}
HunchList.displayName = 'HunchList';

export default graphql(GET_HUNCHES, {
  name: 'hunchesQuery',
  options: ({ hunchListType }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { hunchListType },
  }),
})(HunchList);

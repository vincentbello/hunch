// @flow
import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { compose, graphql } from 'react-apollo';
import { Actions } from 'react-native-router-flux';
import { LoginManager } from 'react-native-fbsdk';
import LOGOUT from 'graphql/mutations/logout';

import Icon from 'react-native-vector-icons/Feather';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import DrawerItem, { defaultProps as itemDefaultProps, type ItemType, type Props as ItemProps } from 'components/DrawerItem';
import LogoutDrawerItem from 'components/LogoutDrawerItem';
import UserCell from 'components/UserCell';

import AppSizes from 'theme/sizes';
import Colors from 'theme/colors';

const styles = StyleSheet.create({
  drawer: {
    marginTop: AppSizes.statusBarHeight + AppSizes.topOffset,
  },
  navbar: {
    height: AppSizes.navbarHeight,
    borderBottomWidth: 1,
    borderColor: Colors.cellBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 8,
  },
});

type Item = {
  iconName?: string,
  label?: string,
  type?: ItemType,
  Component?: React.ComponentType<ItemProps>,
  onPress?: () => void,
};

type Props = CurrentUserProps;

function Drawer({ currentUser }: Props): React.Node {
  const items = [
    {
      iconName: 'star',
      label: 'My Favorite Teams',
      type: itemDefaultProps.type,
      onPress: Actions.favorites,
    },
    {
      Component: LogoutDrawerItem,
    },
  ];

  return (
    <View style={styles.drawer}>
      <View style={styles.navbar}>
        <UserCell emphasized size="small" user={currentUser} />
      </View>
      <FlatList
        data={items}
        style={styles.items}
        scrollEnabled={false}
        keyExtractor={(_: Item, index: number): string => `${index}`}
        renderItem={({ item: { Component, ...itemProps } }): React.Node => (Component ? <Component /> : <DrawerItem {...itemProps} />)}
      />
    </View>
  );
}

Drawer.displayName = 'DrawerContainer';
export default withCurrentUser(Drawer);

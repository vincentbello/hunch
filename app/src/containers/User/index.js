// @flow
import * as React from 'react';
import { Linking, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import Image from 'components/Image';

import Colors from 'theme/colors';
import { BoxStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  User: {
    margin: 8,
  },
  User__header: {
    ...BoxStyles,
    marginBottom: 8,
    flexDirection: 'row',
    padding: 8,
  },
  User__headerContent: {
    marginLeft: 8,
    flex: 1,
  },
  User__headerTitle: {
    ...Typography.h2,
    fontWeight: 'bold',
  },
});

const UserContainer = ({ currentUser }: CurrentUserProps): React.Node => (
  <View style={styles.User}>
    <View style={styles.User__header}>
      <Image bordered rounded size="large" url={currentUser.imageUrl} />
      <View style={styles.User__headerContent}>
        <Text style={styles.User__headerTitle}>{currentUser.fullName}</Text>
      </View>
    </View>
  </View>
);

UserContainer.displayName = 'UserContainer';
export default withCurrentUser(UserContainer);

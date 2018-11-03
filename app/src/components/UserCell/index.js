// @flow
import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import { type User } from 'types/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import Image from 'components/Image';

const styles = StyleSheet.create({
  User: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.cellBorder,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  User__content: {
    flex: 1,
    marginLeft: 8,
  },
});

type Props = {
  user: User,
  onPress: () => void,
};

const UserCell = ({ user, onPress }: Props): React.Node => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.User}>
      <Image rounded size="small" url={user.imageUrl} />
      <View style={styles.User__content}>
        <Text>{user.fullName}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

UserCell.defaultProps = { onPress() {} };
UserCell.displayName = 'UserCell';

export default UserCell;

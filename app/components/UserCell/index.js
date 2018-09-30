// @flow
import * as React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import { type User } from 'types/user';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  User: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  User__image: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.primary.gray,
  },
  User__content: {
    flex: 1,
  },
});

type Props = {
  user: User,
  onPress: () => void,
};

const UserCell = ({ user, onPress }: Props): React.Node => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.User}>
      {user.imageUrl !== null && <Image style={styles.User__image} source={{ uri: user.imageUrl }} />}
      <View style={styles.User__content}>
        <Text>{user.fullName}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

UserCell.defaultProps = { onPress() {} };
UserCell.displayName = 'UserCell';

export default UserCell;

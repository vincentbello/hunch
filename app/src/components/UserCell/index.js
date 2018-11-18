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
    height: 48,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  User_inList: {
    borderBottomWidth: 1,
    borderColor: Colors.cellBorder,
  },
  User__content: {
    // flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});

type Props = {
  inList: boolean,
  user: User,
  onPress: null | (() => void),
  renderMeta: () => React.Node,
};

const UserCell = ({ inList, user, onPress, renderMeta }: Props): React.Node => {
  const s = [styles.User, inList && styles.User_inList];
  const contents = (
    <React.Fragment>
      <Image rounded size="small" url={user.imageUrl} />
      <View style={styles.User__content}>
        <Text>{user.fullName}</Text>
      </View>
      {renderMeta()}
    </React.Fragment>
  );
  return onPress === null ? <View style={s}>{contents}</View> : <TouchableOpacity style={s} onPress={onPress}>{contents}</TouchableOpacity>;
};

UserCell.defaultProps = {
  onPress: null,
  renderMeta: (): React.Node => null,
};
UserCell.displayName = 'UserCell';

export default UserCell;

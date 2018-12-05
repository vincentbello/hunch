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
  content: {
    marginLeft: 8,
    marginRight: 8,
  },
  content_full: {
    flex: 1,
  },
  label: {
    fontSize: 15,
  },
  label_emphasized: {
    fontWeight: 'bold',
  },
});

type Props = {
  emphasized: boolean,
  inList: boolean,
  user: User,
  withDisclosureIndicator: boolean,
  onPress: null | (() => void),
  renderMeta: () => React.Node,
};

const UserCell = ({ emphasized, inList, user, withDisclosureIndicator, onPress, renderMeta }: Props): React.Node => {
  const s = [styles.User, inList && styles.User_inList];
  const contents = (
    <React.Fragment>
      <Image bordered rounded size="small" url={user.imageUrl} />
      <View style={[styles.content, inList && styles.content_full]}>
        <Text style={[styles.label, emphasized && styles.label_emphasized]}>{user.fullName}</Text>
      </View>
      {renderMeta()}
      {withDisclosureIndicator && <Icon name="chevron-right" color={Colors.textSecondary} size={16} />}
    </React.Fragment>
  );
  return onPress === null ? <View style={s}>{contents}</View> : <TouchableOpacity style={s} onPress={onPress}>{contents}</TouchableOpacity>;
};

UserCell.defaultProps = {
  emphasized: false,
  withDisclosureIndicator: false,
  onPress: null,
  renderMeta: (): React.Node => null,
};
UserCell.displayName = 'UserCell';

export default UserCell;

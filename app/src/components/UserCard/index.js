// @flow
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { distanceInWordsToNow, format } from 'date-fns';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Feather';

import { type User } from 'types/user';
import FriendshipButton from 'components/FriendshipButton';
import Image from 'components/Image';
import UserStats from 'components/UserStats';

import Colors from 'theme/colors';
import { BoxStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  user: {
    margin: 8,
  },
  section: {
    ...BoxStyles,
    marginBottom: 8,
    padding: 8,
  },
  section_row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section_clear: {
    marginTop: 4,
    marginBottom: 12,
  },
  sectionHeader: {
    ...Typography.h4,
    fontWeight: '900',
    marginBottom: 2,
  },
  headerContent: {
    marginLeft: 8,
    flex: 1,
  },
  headerTitle: {
    ...Typography.h2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerMeta: {
    ...Typography.h5,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  button: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 12,
    backgroundColor: Colors.white,
    borderColor: Colors.brand.primary,
    borderWidth: 1,
    borderRadius: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontWeight: 'bold',
    color: Colors.brand.primary,
  },
});

type Props = {
  isCurrent: boolean,
  user: User,
};

const UserCard = ({ isCurrent, user }: Props): React.Node => (
  <View style={styles.user}>
    <View style={[styles.section, styles.section_row]}>
      <Image bordered rounded size="large" url={user.imageUrl} />
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
        <Text style={styles.headerMeta}>
          {`Member since ${format(user.createdAt, 'MMMM D, YYYY')}`}
        </Text>
        <Text style={styles.headerMeta}>
          {`Last seen ${distanceInWordsToNow(user.lastLoginAt, { addSuffix: true })}`}
        </Text>
      </View>
    </View>
    {!isCurrent && (
      <View style={[styles.section_row, styles.section_clear]}>
        <FriendshipButton userId={user.id} />
        <Button
          containerStyle={styles.button}
          styleDisabled={{ backgroundColor: Colors.iconButton.underlay }}
          onPress={console.log}
        >
          <Icon name="users" color={Colors.brand.primary} size={16} style={styles.buttonIcon} />
          <Text style={styles.buttonLabel}>{`${user.friendCount} friends`}</Text>
        </Button>
      </View>
    )}
    <Text style={styles.sectionHeader}>Statistics</Text>
    <View style={styles.section}>
      <UserStats userId={user.id} />
    </View>
  </View>
);

UserCard.displayName = 'UserCard';
export default UserCard;

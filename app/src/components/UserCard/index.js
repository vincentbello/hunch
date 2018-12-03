// @flow
import * as React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { distanceInWordsToNow, format } from 'date-fns';
import pluralize from 'pluralize';
import { Actions } from 'react-native-router-flux';
import { compose, graphql, Query } from 'react-apollo';
import GET_FRIENDSHIP from 'graphql/queries/getUserFriendship';
import GET_STATS from 'graphql/queries/getUserStats';
import GET_USER from 'graphql/queries/getUser';
import UPDATE_FRIENDSHIP_STATUS from 'graphql/mutations/updateFriendshipStatus';

import { type Error } from 'types/apollo';
import { type FriendshipStatus, type User, type UserFriendship } from 'types/user';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Feather';
import DerivedStateSplash from 'components/DerivedStateSplash';
import DualAction from 'components/DualAction';
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
  action: {
    padding: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cellBorder,
  },
  actionLabel: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabelText: {
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  actionButton: {
    marginBottom: 12,
    backgroundColor: Colors.brand.primary,
    padding: 12,
    borderRadius: 4,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
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
  userFriendshipQuery: {
    loading: boolean,
    error: Error,
    userFriendship: UserFriendship,
  },
  updateFriendshipStatus: ({ variables: { userId: number, status: FriendshipStatus } }) => void,
};

const updateHandler = (userId: number, oldFriendship: UserFriendship): (() => void) => (cache, { data: { updateFriendshipStatus: newFriendship } }) => {
  const friendshipQuery = { query: GET_FRIENDSHIP, variables: { userId } };
  const { userFriendship } = cache.readQuery(friendshipQuery);
  if (userFriendship === null) cache.writeQuery({ ...friendshipQuery, data: { userFriendship: newFriendship } });
  if (newFriendship.status === 'ACTIVE' || (oldFriendship.status === 'ACTIVE' && newFriendship.status === 'DELETED')) {
    const userQuery = { query: GET_USER, variables: { id: userId } };
    const { user } = cache.readQuery(userQuery);
    const increment = newFriendship.status === 'ACTIVE' ? 1 : -1;
    if (user !== null) cache.writeQuery({ ...userQuery, data: { user: { ...user, friendCount: user.friendCount + increment } } });
  }
};

class UserCard extends React.PureComponent<Props> {
  static displayName = 'UserCard';

  get needsAction(): boolean {
    const { isCurrent, user, userFriendshipQuery: q } = this.props;
    return !isCurrent && q && q.userFriendship && q.userFriendship.status === 'PENDING' && q.userFriendship.userId === user.id;
  }

  updateFriendshipStatus = (status: FriendshipStatus): void => this.props.updateFriendshipStatus({ variables: { userId: this.props.user.id, status } });

  render(): React.Node {
    const { isCurrent, user, userFriendshipQuery } = this.props;
    const { needsAction } = this;
    return (
      <ScrollView stickyHeaderIndices={needsAction ? [0] : []}>
        {needsAction && (
          <View style={styles.action}>
            <View style={styles.actionLabel}>
              <Icon name="bell" size={16} color={Colors.textPrimary} />
              <Text style={styles.actionLabelText}>{`${user.firstName} sent you a friend request.`}</Text>
            </View>
            <DualAction
              canPerformPrimaryAction
              canPerformSecondaryAction
              primaryAction={(): void => this.updateFriendshipStatus('ACTIVE')}
              primaryLabel="Accept"
              secondaryAction={(): void => this.updateFriendshipStatus('REJECTED')}
              secondaryLabel="Reject"
            />
          </View>
        )}
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
            <React.Fragment>
              <View style={[styles.section_row, styles.section_clear]}>
                <DerivedStateSplash loading={userFriendshipQuery.loading} error={userFriendshipQuery.error} size="small">
                  <FriendshipButton
                    friendship={userFriendshipQuery.userFriendship}
                    name={user.firstName}
                    userId={user.id}
                    updateFriendshipStatus={this.updateFriendshipStatus}
                  />
                </DerivedStateSplash>
                <Button
                  containerStyle={styles.button}
                  styleDisabled={{ backgroundColor: Colors.iconButton.underlay }}
                  onPress={(): void => Actions.userFriends({ userId: user.id, title: `${user.firstName}'s friends` })}
                >
                  <Icon name="users" color={Colors.brand.primary} size={16} style={styles.buttonIcon} />
                  <Text style={styles.buttonLabel}>{pluralize('friend', user.friendCount, true)}</Text>
                </Button>
              </View>
              {userFriendshipQuery.userFriendship && userFriendshipQuery.userFriendship.status === 'ACTIVE' && (
                <Button
                  containerStyle={styles.actionButton}
                  style={styles.actionButtonText}
                  onPress={(): void => Actions.createBetModal({ preselectedBettee: user })}
                >
                  {`Challenge ${user.firstName} to a Bet`}
                </Button>
              )}
            </React.Fragment>
          )}
          <Query query={GET_STATS} variables={{ userId: user.id }}>
            {({ loading, error, data }): React.Node => (
              <React.Fragment>
                <Text style={styles.sectionHeader}>Statistics</Text>
                <View style={styles.section}>
                  <DerivedStateSplash loading={loading} error={error}>
                    {Boolean(data) && Boolean(data.userStats) && <UserStats stats={data.userStats.overall} />}
                  </DerivedStateSplash>
                </View>
                {!isCurrent && (
                  <React.Fragment>
                    <Text style={styles.sectionHeader}>Against Me</Text>
                    <View style={styles.section}>
                      <DerivedStateSplash loading={loading} error={error}>
                        {Boolean(data) && Boolean(data.userStats) && <UserStats stats={data.userStats.against} />}
                      </DerivedStateSplash>
                    </View>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Query>
        </View>
      </ScrollView>
    );
  }
}

export default compose(
  graphql(GET_FRIENDSHIP, {
    name: 'userFriendshipQuery',
    options: ({ user }) => ({ variables: { userId: user.id } }),
    skip: ({ isCurrent }) => isCurrent,
  }),
  graphql(UPDATE_FRIENDSHIP_STATUS, {
    name: 'updateFriendshipStatus',
    options: ({ user, userFriendshipQuery }) => ({
      update: updateHandler(user.id, userFriendshipQuery && userFriendshipQuery.userFriendship),
    }),
  }),
)(UserCard);

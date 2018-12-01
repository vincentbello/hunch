// @flow
import * as React from 'react';
import { ActionSheetIOS, View, StyleSheet, Text } from 'react-native';
import Button from 'react-native-button';
import { graphql } from 'react-apollo';
import GET_FRIENDSHIP from 'graphql/queries/getUserFriendship';

import Icon from 'react-native-vector-icons/Feather';

import { type Error } from 'types/apollo';
import { type UserFriendship as UserFriendshipType } from 'types/user';

import DerivedStateSplash from 'components/DerivedStateSplash';

import Colors from 'theme/colors';

type ButtonAttrs = {
  disabled: boolean,
  icon: null | string,
  label: string,
  primary: boolean,
  action: null | string,
};

const styles = StyleSheet.create({
  button: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.brand.primary,
    borderWidth: 1,
    borderRadius: 3,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.brand.primary,
  },
  label_primary: {
    color: Colors.white,
  },
  label_disabled: {
    color: Colors.textSecondary,
  },
});

type Props = {
  userId: number,
  userFriendshipQuery: {
    loading: boolean,
    error: Error,
    userFriendship: UserFriendshipType,
  },
};

const getButtonAttrs = (friendship?: UserFriendshipType | null, userId: number): ButtonAttrs | null => {
  if (!friendship || (friendship.status === 'REJECTED' && friendship.userId !== userId)) {
    return {
      disabled: false,
      icon: 'user-plus',
      label: 'Add Friend',
      primary: true,
      action: 'REQUEST_FRIENDSHIP',
    };
  }

  if (friendship.status === 'ACTIVE') {
    return {
      disabled: false,
      icon: 'user-check',
      label: 'Friends',
      primary: false,
      action: 'UNFRIEND',
    };
  }

  if (friendship.status === 'PENDING') {
    return {
      disabled: friendship.userId !== userId,
      icon: null,
      label: friendship.userId === userId ? 'Requested' : 'Received Request',
      primary: false,
      action: friendship.userId === userId ? 'CANCEL_REQUEST' : null,
    };
  }

  return null;
};

class FriendshipButton extends React.PureComponent<Props> {
  onPressHandler = (action: string | null): (() => void) => () => {
    const friendship = this.props.userFriendshipQuery.userFriendship;
    if (action === null) return;

    if (action === 'UNFRIEND') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Cancel', 'Unfriend'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        message: 'Remove xxx as a friend?',
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1) console.log('UNFRIEND!');
      });
    }
  };

  render(): React.Node {
    const { userId, userFriendshipQuery: { loading, error, userFriendship } } = this.props;
    const buttonAttrs = getButtonAttrs(userFriendship, userId);
    return (
      <DerivedStateSplash loading={loading} error={error} size="small">
        {buttonAttrs !== null && (
          <Button
            disabled={buttonAttrs.disabled}
            containerStyle={styles.button}
            onPress={this.onPressHandler(buttonAttrs.action)}
          >
            {buttonAttrs.icon !== null && (
              <Icon
                name={buttonAttrs.icon}
                color={buttonAttrs.disabled ? Colors.textSecondary : (buttonAttrs.primary ? Colors.white : Colors.brand.primary)}
                size={16}
                style={styles.icon}
              />
            )}
            <Text style={[styles.label, buttonAttrs.primary && styles.label_primary, buttonAttrs.disabled && styles.label_disabled]}>
              {buttonAttrs.label}
            </Text>
          </Button>
        )}
      </DerivedStateSplash>
    );
  }
}

FriendshipButton.displayName = 'FriendshipButton';
export default graphql(GET_FRIENDSHIP, { name: 'userFriendshipQuery', options: ({ userId }) => ({ variables: { userId } }) })(FriendshipButton);

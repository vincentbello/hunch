// @flow
import * as React from 'react';
import { ActionSheetIOS, StyleSheet, Text } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Feather';

import { type UserFriendship, type FriendshipStatus } from 'types/user';

import Colors from 'theme/colors';

type ButtonAttrs = {
  disabled: boolean,
  icon: null | string,
  label: string,
  primary: boolean,
  targetStatus: null | FriendshipStatus,
  confirmation: null | string,
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
  button_primary: {
    backgroundColor: Colors.brand.primary,
  },
  button_disabled: {
    borderColor: Colors.textSecondary,
    backgroundColor: Colors.background,
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
  name: string,
  userId: number,
  friendship: UserFriendship,
  updateFriendshipStatus: (status: FriendshipStatus) => void,
};

class FriendshipButton extends React.PureComponent<Props> {
  get buttonAttrs(): ButtonAttrs | null {
    const { friendship, userId } = this.props;
    if (!friendship || friendship.status === 'DELETED' || (friendship.status === 'REJECTED' && friendship.userId !== userId)) {
      return {
        disabled: false,
        icon: 'user-plus',
        label: 'Add Friend',
        primary: true,
        targetStatus: 'PENDING',
        confirmation: null,
      };
    }

    if (friendship.status === 'ACTIVE') {
      return {
        disabled: false,
        icon: 'user-check',
        label: 'Friends',
        primary: false,
        targetStatus: 'DELETED',
        confirmation: 'UNFRIEND',
      };
    }

    if (friendship.status === 'PENDING') {
      return {
        disabled: friendship.userId === userId,
        icon: null,
        label: friendship.userId === userId ? 'Received Request' : 'Requested',
        primary: false,
        targetStatus: friendship.userId === userId ? null : 'DELETED',
        confirmation: 'CANCEL_REQUEST',
      };
    }

    return null;
  }

  onPressHandler = (targetStatus: FriendshipStatus | null, confirmation: string | null): (() => void) => () => {
    const { name, updateFriendshipStatus } = this.props;
    if (targetStatus === null) return;

    if (confirmation !== null) {
      const unfriend = confirmation === 'UNFRIEND';
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Cancel', unfriend ? 'Unfriend' : 'Cancel Request'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        message: unfriend ? `Are you sure you want to remove ${name} from your friends? You will not be able to bet with them anymore.` : `Are you sure you want to cancel your friend request to ${name}?`,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1 && targetStatus !== null) updateFriendshipStatus(targetStatus);
      });
      return;
    }

    this.props.updateFriendshipStatus(targetStatus);
  };

  render(): React.Node {
    const { buttonAttrs } = this;
    if (buttonAttrs === null) return null;
    return (
      <Button
        disabled={buttonAttrs.disabled}
        containerStyle={[styles.button, buttonAttrs.primary && styles.button_primary, buttonAttrs.disabled && styles.button_disabled]}
        onPress={this.onPressHandler(buttonAttrs.targetStatus, buttonAttrs.confirmation)}
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
    );
  }
}

FriendshipButton.displayName = 'FriendshipButton';
export default FriendshipButton;

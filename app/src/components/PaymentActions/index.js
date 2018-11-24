// @flow
import * as React from 'react';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';

import { type User } from 'types/user';

import Colors from 'theme/colors';
import AppSizes from 'theme/sizes';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type PaymentOption = {
  color: string,
  iconName: string,
  iconSize: number,
  iconType: 'feather' | 'material',
  name: string,
  urls: (user: User) => Array<string>,
};

const PAYMENT_OPTIONS: Array<PaymentOption> = [
  {
    color: Colors.thirdParty.facebook,
    iconName: 'facebook-messenger',
    iconSize: 22,
    iconType: 'material',
    name: 'Messenger',
    urls: (user: User): Array<string> => [/**`fb-messenger://user-thread/${user.fbId}`, */`https://www.messenger.com/t/${user.fbId}`], // TODO: Figure out FB username
  },
  {
    color: Colors.thirdParty.cashApp,
    iconName: 'square-inc-cash',
    iconSize: 18,
    iconType: 'material',
    name: 'the Cash App',
    urls: (): Array<string> => ['squarecash://', 'https://cash.me'],
  },
  {
    color: Colors.thirdParty.venmo,
    iconName: 'venmo',
    iconSize: 22,
    iconType: 'material',
    name: 'Venmo',
    urls: (): Array<string> => ['venmo://', 'https://www.venmo.com'],
  },
  {
    color: Colors.thirdParty.iMessage,
    iconName: 'message-circle',
    iconSize: 20,
    iconType: 'feather',
    name: 'Messages',
    urls: (user: User): Array<string> => ['sms://'],
  },
];

const styles = StyleSheet.create({
  buttonList: {
    flexGrow: 0,
  },
  item: {
    marginTop: 4,
  },
  button: {
    width: AppSizes.screen.width - 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    backgroundColor: Colors.transparent,
    color: Colors.white,
  },
  moreButton: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
});

async function openLink(url: string, fallbackUrl?: string): Promise<void> {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else if (fallbackUrl) {
    const fallbackSupported = await Linking.canOpenURL(fallbackUrl);
    if (fallbackSupported) {
      Linking.openURL(fallbackUrl);
    } else {
      console.warn('Cannot open either URL.');
    }
  } else {
    console.warn('Cannot open URL.');
  }
}

type Props = {
  user: User,
};

type State = {
  showingAll: boolean,
};

export default class PaymentActions extends React.Component<Props, State> {
  state = { showingAll: false };

  get displayedOptions(): Array<PaymentOption> {
    return this.state.showingAll ? PAYMENT_OPTIONS : PAYMENT_OPTIONS.slice(0, 2);
  }

  render(): React.Node {
    return (
      <View style={styles.buttonList}>
        <FlatList
          data={this.displayedOptions}
          keyExtractor={(option: PaymentOption): string => option.name}
          style={styles.buttonList}
          renderItem={({ item, index }): React.Node => {
            const Icon = item.iconType === 'feather' ? FeatherIcon : MaterialIcon;
            return (
              <View style={styles.item}>
                <Icon.Button
                  backgroundColor={item.color}
                  name={item.iconName}
                  size={item.iconSize}
                  style={styles.button}
                  onPress={async (): Promise<void> => openLink(...item.urls(this.props.user))}
                >
                  <Text style={styles.buttonText}>
                    Pay with {item.name}
                  </Text>
                </Icon.Button>
              </View>
            );
          }}
        />

        <View style={styles.item}>
          <Button
            style={styles.moreButton}
            onPress={(): void => this.setState({ showingAll: !this.state.showingAll })}
          >
            {this.state.showingAll ? 'Show Less' : 'Show More Payment Options'}
          </Button>
        </View>
      </View>
    );
  }
}

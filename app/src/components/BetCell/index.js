// @flow
import * as React from 'react';
import { AsyncStorage, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { distanceInWordsToNow } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import { type Bet } from 'types/bet';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const NOW = new Date();

const styles = StyleSheet.create({
  Bet: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: 'white',
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
  },
  Bet__image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.primary.gray,
  },
  Bet__content: {
    flex: 1,
  },
  Bet__header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Bet__link: {
    fontWeight: '800',
  },
  Bet__label: {
    color: Colors.primary.green,
    fontSize: 20,
    fontWeight: '900',
  },
  Bet__headerText: {
    flex: 1,
    color: Colors.textPrimary,
    ...Typography.base,
  },
  Bet__body: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  Bet__meta: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.primary.gray,
  },
});

type Props = {
  bet: Bet,
  userId: number,
  onPress: () => void,
};

export default class BetCell extends React.PureComponent<Props> {
  static defaultProps = { onPress() {} };

  get displayedImageUrl(): string | null {
    if (this.isInvolved) return this.isBettor ? this.props.bet.bettee.imageUrl : this.props.bet.bettor.imageUrl;
    return this.props.bet.bettor.imageUrl;
  }

  get isBettor(): boolean {
    return this.props.userId === this.props.bet.bettor.id;
  }

  get isInvolved(): boolean {
    const { bet, userId } = this.props;
    return userId === bet.bettorId || userId === bet.betteeId;
  }

  render(): React.Node {
    const { displayedImageUrl, isBettor, isInvolved } = this;
    const { bet, userId, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.Bet}>
          {displayedImageUrl !== null && <Image style={styles.Bet__image} source={{ uri: displayedImageUrl }} />}
          <View style={styles.Bet__content}>
            <View style={styles.Bet__header}>
              <Text style={styles.Bet__headerText}>
                {isInvolved && isBettor ? <Text>You</Text> : <Text style={styles.Bet__link}>{bet.bettor.fullName}</Text>}
                <Text> bet </Text>
                {isInvolved && !isBettor ? <Text>you</Text> : <Text style={styles.Bet__link}>{bet.bettee.fullName}</Text>}
              </Text>
              <Text style={styles.Bet__label}>${bet.amount}</Text>
            </View>
            <Text style={styles.Bet__body}>“{bet.wager}”</Text>
            <Text style={styles.Bet__meta}>{distanceInWordsToNow(bet.createdAt, { addSuffix: true })}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

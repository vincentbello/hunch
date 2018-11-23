// @flow
import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { distanceInWordsToNow } from 'date-fns';

import { type Bet } from 'types/bet';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetActions from 'components/BetActions';
import Image from 'components/Image';

const styles = StyleSheet.create({
  Bet: {
    backgroundColor: Colors.white,
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  Bet__container: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: Colors.white,
    borderRadius: 2,
    alignItems: 'center',
  },
  Bet__content: {
    flex: 1,
    marginLeft: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  Bet__labelText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  Bet__labelText_green: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary.green,
  },
  Bet__labelText_red: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary.red,
  },
  Bet__labelSuperscript: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 1,
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
  Bet__footer: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});

type Props = {
  bet: Bet,
  disabled: boolean,
  userId: number,
  onPress: () => void,
};

export default class BetCell extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    onPress() {},
  };

  get displayedImageUrl(): string | null {
    if (this.isInvolved) return this.isBettor ? this.props.bet.bettee.imageUrl : this.props.bet.bettor.imageUrl;
    return this.props.bet.bettor.imageUrl;
  }

  get isBettor(): boolean {
    return this.props.userId === this.props.bet.bettor.id;
  }

  get isInvolved(): boolean {
    const { bet, userId } = this.props;
    return userId === bet.bettor.id || userId === bet.bettee.id;
  }

  renderBetAmount = (): React.Node => {
    const { bet, userId } = this.props;
    const isComplete = bet.winnerId !== null;
    const labelTextStyle = [styles.Bet__labelText, isComplete && styles[`Bet__labelText_${bet.winnerId === userId ? 'green' : 'red'}`]];
    return (
      <React.Fragment>
        {bet.winnerId !== null && <Text style={styles.Bet__labelText}>{bet.winnerId === userId ? 'Won' : 'Lost'}</Text>}
        <Text style={styles.Bet__labelSuperscript}>$</Text>
        <Text style={labelTextStyle}>{bet.amount}</Text>
      </React.Fragment>
    );
  };

  render(): React.Node {
    const { displayedImageUrl, isBettor, isInvolved } = this;
    const { bet, disabled, onPress } = this.props;
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View style={styles.Bet}>
          <View style={styles.Bet__container}>
            <Image bordered rounded url={displayedImageUrl} />
            <View style={styles.Bet__content}>
              <View style={styles.Bet__header}>
                <Text style={styles.Bet__headerText}>
                  {isInvolved && isBettor ? <Text>You</Text> : <Text style={styles.Bet__link}>{bet.bettor.fullName}</Text>}
                  <Text> bet </Text>
                  {isInvolved && !isBettor ? <Text>you</Text> : <Text style={styles.Bet__link}>{bet.bettee.fullName}</Text>}
                </Text>
                <View style={styles.Bet__label}>{this.renderBetAmount()}</View>
              </View>
              <Text style={styles.Bet__body}>{bet.wager.length > 0 ? `“${bet.wager}”` : ''}</Text>
              <Text style={styles.Bet__meta}>{distanceInWordsToNow(bet.createdAt, { addSuffix: true })}</Text>
            </View>
          </View>
          {!bet.responded && (
            <View style={styles.Bet__footer}>
              <BetActions bet={bet} isBettor={isBettor} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

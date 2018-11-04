// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { AsyncStorage, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { distanceInWordsToNow, differenceInDays } from 'date-fns';
import { Mutation } from 'react-apollo';
import betFragment from 'graphql/fragments/bet';
import GET_BET from 'graphql/queries/getBet';
import GET_BETS from 'graphql/queries/getBets';
import REMIND_BET_REQUEST from 'graphql/mutations/remindBetRequest';
import RESPOND_TO_BET from 'graphql/mutations/respondToBet';

import { type Bet } from 'types/bet';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

import Image from 'components/Image';

const NOW = new Date();

// const onBetUpdate = (mutationKey: string) => (cache, { data }) => {
//   console.log('ON BET UPDATE');
//   const mutationData = data[mutationKey];
//   cache.writeFragment({
//     id,
//     fragment: betFragment,
//     data: { __typename: 'Bet', ...mutationData },
//   });
// };

const onBetRespond = (cache, { data: { respondToBet } }) => {
  console.log('ON BET RESPOND', respondToBet);
  const activeBetsQuery = { query: GET_BETS, variables: { betListType: 'ACTIVE' } };
  const requestedBetsQuery = { query: GET_BETS, variables: { betListType: 'REQUESTED' } };
  const newBet = cache.readQuery({ query: GET_BET, variables: { betId: respondToBet.id } });
  console.log('new bet', newBet);
  const { bets: activeBets } = cache.readQuery(activeBetsQuery);
  // const { bets: requestedBets } = cache.readQuery(requestedBetsQuery);
  console.log('active bets', activeBets);
  // console.log('requested bets', requestedBets);
  cache.writeQuery({
    ...activeBetsQuery,
    // bets: [...activeBets, newBet], // TODO: Figure this out!!
  });
  // cache.writeQuery({
  //   ...requestedBetsQuery,
  //   data: { __typename: 'Bet', bets: requestedBets.filter(bet => bet.id !== respondToBet.id) },
  // });
};

const styles = StyleSheet.create({
  Bet: {
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    color: Colors.primary.green,
    fontSize: 20,
    fontWeight: '900',
  },
  Bet__label_red: {
    color: Colors.primary.red,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  Bet__footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  Bet__buttonContainer: {
    flex: 1,
  },
  Bet__buttonPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  Bet__button: {
    overflow: 'hidden',
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  Bet__button_primary: {
    marginRight: 0,
    backgroundColor: Colors.brand.primary,
  },
  Bet__buttonText: {
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  Bet__buttonText_primary: {
    color: Colors.white,
  },
});

type Props = {
  bet: Bet,
  disabled: boolean,
  isResponding: boolean,
  userId: number,
  onPress: () => void,
  cancelRequest: () => void,
  remind: () => void,
  respond: (accept: boolean) => void,
};

class BetCell extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    isResponding: false,
    onPress() {},
    cancelRequest() {},
    remind() {},
    respond() {},
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

  get betOutcome(): string {
    const { bet, userId } = this.props;
    const amount = `$${bet.amount}`;

    if (bet.winnerId === null) return amount;
    return `${bet.winnerId === userId ? 'Won' : 'Lost'} ${amount}`;
  }

  get primaryAction(): () => void {
    const { remind, respond } = this.props;
    const { id } = this.props.bet;
    return this.isBettor ? this.remind : this.respond(true);
  }

  get secondaryAction(): () => void {
    return this.isBettor ? this.props.cancelRequest : this.respond(false);
  }

  remind = (): void => this.props.remind({ variables: { id: this.props.bet.id } });

  respond = (accepted: boolean): (() => void) => (): void => this.props.respond({ variables: { id: this.props.bet.id, accepted } });

  render(): React.Node {
    const { displayedImageUrl, isBettor, isInvolved } = this;
    const { bet, disabled, isResponding, userId, remind, onPress } = this.props;
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View style={styles.Bet}>
          <View style={styles.Bet__container}>
            <Image rounded url={displayedImageUrl} />
            <View style={styles.Bet__content}>
              <View style={styles.Bet__header}>
                <Text style={styles.Bet__headerText}>
                  {isInvolved && isBettor ? <Text>You</Text> : <Text style={styles.Bet__link}>{bet.bettor.fullName}</Text>}
                  <Text> bet </Text>
                  {isInvolved && !isBettor ? <Text>you</Text> : <Text style={styles.Bet__link}>{bet.bettee.fullName}</Text>}
                </Text>
                <Text style={[styles.Bet__label, bet.winnerId !== null && bet.winnerId !== userId && styles.Bet__label_red]}>
                  {this.betOutcome}
                </Text>
              </View>
              <Text style={styles.Bet__body}>“{bet.wager}”</Text>
              <Text style={styles.Bet__meta}>{distanceInWordsToNow(bet.createdAt, { addSuffix: true })}</Text>
            </View>
          </View>
          {!bet.responded && (
            <View style={styles.Bet__footer}>
              {isResponding ? (
                <Text style={styles.Bet__footerText}>Responding...</Text>
              ) : (
                <React.Fragment>
                  <TouchableOpacity onPress={this.secondaryAction} style={styles.Bet__buttonContainer}>
                    <View style={styles.Bet__button}>
                      <Text style={styles.Bet__buttonText}>{isBettor ? 'Cancel Bet' : 'Decline'}</Text>
                    </View>
                  </TouchableOpacity>
                  {isBettor && differenceInDays(new Date(), bet.lastRemindedAt) < 2 ? (
                    <Text style={styles.Bet__buttonPlaceholder}>
                      {bet.lastRemindedAt === bet.createdAt ? 'Created' : 'Reminded'} {distanceInWordsToNow(bet.lastRemindedAt, { addSuffix: true })}
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={this.primaryAction} style={styles.Bet__buttonContainer}>
                      <View style={[styles.Bet__button, styles.Bet__button_primary]}>
                        <Text style={[styles.Bet__buttonText, styles.Bet__buttonText_primary]}>{isBettor ? 'Remind' : 'Accept'}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </React.Fragment>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default compose(
  graphql(REMIND_BET_REQUEST, { name: 'remind' }),
  graphql(RESPOND_TO_BET, { name: 'respond', options: { update: onBetRespond } })
)(BetCell);

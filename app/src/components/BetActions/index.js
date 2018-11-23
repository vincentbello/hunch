// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { distanceInWordsToNow, differenceInDays } from 'date-fns';
import GET_BET from 'graphql/queries/getBet';
import GET_BETS from 'graphql/queries/getBets';
import CANCEL_BET_REQUEST from 'graphql/mutations/cancelBetRequest';
import REMIND_BET_REQUEST from 'graphql/mutations/remindBetRequest';
import RESPOND_TO_BET from 'graphql/mutations/respondToBet';

import chain from 'utils/functions';

import Colors from 'theme/colors';

import { type Bet } from 'types/bet';

const onBetCancel = (cache, { data: { cancelBetRequest: id } }) => {
  const pendingBetsQuery = { query: GET_BETS, variables: { betListType: 'PENDING' } };
  const { bets: pendingBets } = cache.readQuery(pendingBetsQuery);
  cache.writeQuery({ ...pendingBetsQuery, data: { bets: pendingBets.filter((bet: Bet): boolean => bet.id !== id) } });
  cache.data.delete(`Bet:${id}`);
};

const onBetRespond = (cache, { data: { respondToBet } }) => {
  const activeBetsQuery = { query: GET_BETS, variables: { betListType: 'ACTIVE' } };
  const requestedBetsQuery = { query: GET_BETS, variables: { betListType: 'REQUESTED' } };
  const { bet: newBet } = cache.readQuery({ query: GET_BET, variables: { betId: respondToBet.id } });
  const { bets: activeBets } = cache.readQuery(activeBetsQuery);
  const { bets: requestedBets } = cache.readQuery(requestedBetsQuery);
  cache.writeQuery({ ...activeBetsQuery, data: { bets: [...activeBets, newBet] } });
  cache.writeQuery({ ...requestedBetsQuery, data: { bets: requestedBets.filter((bet: Bet): boolean => bet.id !== respondToBet.id) } });
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  buttonPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    overflow: 'hidden',
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  button_primary: {
    marginRight: 0,
    backgroundColor: Colors.brand.primary,
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonText_primary: {
    color: Colors.white,
  },
});

type Props = {
  bet: Bet,
  isBettor: boolean,
  cancel: () => void,
  remind: () => void,
  respond: (accept: boolean) => void,
  onCancel: () => void,
};

class BetActions extends React.PureComponent<Props> {
  static defaultProps = {
    isBettor: false,
    cancel() {},
    remind() {},
    respond() {},
    onCancel() {},
  };

  get primaryAction(): () => void {
    return this.props.isBettor ? this.remind : this.respond(true);
  }

  get secondaryAction(): () => void {
    return this.props.isBettor ? this.cancel : this.respond(false);
  }

  cancel = (): void => this.props.cancel({ variables: { id: this.props.bet.id } });

  remind = (): void => this.props.remind({ variables: { id: this.props.bet.id } });

  respond = (accepted: boolean): (() => void) => (): void => this.props.respond({ variables: { id: this.props.bet.id, accepted } });

  render(): React.Node {
    const { bet, isBettor } = this.props;
    return (
      <View style={styles.actions}>
        <TouchableOpacity onPress={this.secondaryAction} style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{isBettor ? 'Cancel Bet' : 'Decline'}</Text>
          </View>
        </TouchableOpacity>
        {isBettor && differenceInDays(new Date(), bet.lastRemindedAt) < 2 ? (
          <Text style={styles.buttonPlaceholder}>
            {bet.lastRemindedAt === bet.createdAt ? 'Created ' : 'Reminded '}
            {distanceInWordsToNow(bet.lastRemindedAt, { addSuffix: true })}
          </Text>
        ) : (
          <TouchableOpacity onPress={this.primaryAction} style={styles.buttonContainer}>
            <View style={[styles.button, styles.button_primary]}>
              <Text style={[styles.buttonText, styles.buttonText_primary]}>{isBettor ? 'Remind' : 'Accept'}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default compose(
  graphql(CANCEL_BET_REQUEST, { name: 'cancel', options: props => ({ update: chain(onBetCancel, props.onCancel) }) }),
  graphql(REMIND_BET_REQUEST, { name: 'remind' }),
  graphql(RESPOND_TO_BET, { name: 'respond', options: { update: onBetRespond } }),
)(BetActions);

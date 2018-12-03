// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { distanceInWordsToNow, differenceInDays } from 'date-fns';
import GET_BET from 'graphql/queries/getBet';
import GET_BETS from 'graphql/queries/getBets';
import CANCEL_BET_REQUEST from 'graphql/mutations/cancelBetRequest';
import REMIND_BET_REQUEST from 'graphql/mutations/remindBetRequest';
import RESPOND_TO_BET from 'graphql/mutations/respondToBet';

import { chain, noop } from 'utils/functions';

import DualAction from 'components/DualAction';

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
      <DualAction
        canPerformPrimaryAction={!isBettor || differenceInDays(new Date(), bet.lastRemindedAt) >= 2}
        canPerformSecondaryAction
        primaryAction={this.primaryAction}
        primaryLabel={isBettor ? 'Remind' : 'Accept'}
        primaryPlaceholder={`${bet.lastRemindedAt === bet.createdAt ? 'Created' : 'Reminded'} ${distanceInWordsToNow(bet.lastRemindedAt, { addSuffix: true })}`}
        secondaryAction={this.secondaryAction}
        secondaryLabel={isBettor ? 'Cancel Bet' : 'Decline'}
      />
    );
  }
}

export default compose(
  graphql(CANCEL_BET_REQUEST, { name: 'cancel', options: props => ({ update: chain(onBetCancel, props.onCancel || noop) }) }),
  graphql(REMIND_BET_REQUEST, { name: 'remind' }),
  graphql(RESPOND_TO_BET, { name: 'respond', options: { update: onBetRespond } }),
)(BetActions);

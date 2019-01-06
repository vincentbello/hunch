// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { distanceInWordsToNow, differenceInDays } from 'date-fns';
import GET_HUNCH from 'graphql/queries/getHunch';
import GET_HUNCHES from 'graphql/queries/getHunches';
import CANCEL_HUNCH_REQUEST from 'graphql/mutations/cancelHunchRequest';
import REMIND_HUNCH_REQUEST from 'graphql/mutations/remindHunchRequest';
import RESPOND_TO_HUNCH from 'graphql/mutations/respondToHunch';

import { chain, noop } from 'utils/functions';

import DualAction from 'components/DualAction';

import { type Hunch } from 'types/hunch';

const onHunchCancel = (cache, { data: { cancelHunchRequest: id } }) => {
  const pendingHunchesQuery = { query: GET_HUNCHES, variables: { hunchListType: 'PENDING' } };
  const { hunches: pendingHunches } = cache.readQuery(pendingHunchesQuery);
  cache.writeQuery({ ...pendingHunchesQuery, data: { hunches: pendingHunches.filter((hunch: Hunch): boolean => hunch.id !== id) } });
  cache.data.delete(`Hunch:${id}`);
};

const onHunchRespond = (cache, { data: { respondToHunch } }) => {
  const activeHunchesQuery = { query: GET_HUNCHES, variables: { hunchListType: 'ACTIVE' } };
  const requestedHunchesQuery = { query: GET_HUNCHES, variables: { hunchListType: 'REQUESTED' } };
  const { hunch: newHunch } = cache.readQuery({ query: GET_HUNCH, variables: { hunchId: respondToHunch.id } });
  const { hunches: activeHunches } = cache.readQuery(activeHunchesQuery);
  const { hunches: requestedHunches } = cache.readQuery(requestedHunchesQuery);
  cache.writeQuery({ ...activeHunchesQuery, data: { hunches: [...activeHunches, newHunch] } });
  cache.writeQuery({ ...requestedHunchesQuery, data: { hunches: requestedHunches.filter((hunch: Hunch): boolean => hunch.id !== respondToHunch.id) } });
};

type Props = {
  hunch: Hunch,
  isBettor: boolean,
  cancel: () => void,
  remind: () => void,
  respond: (accept: boolean) => void,
  onCancel: () => void,
};

class HunchActions extends React.PureComponent<Props> {
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

  cancel = (): void => this.props.cancel({ variables: { id: this.props.hunch.id } });

  remind = (): void => this.props.remind({ variables: { id: this.props.hunch.id } });

  respond = (accepted: boolean): (() => void) => (): void => this.props.respond({ variables: { id: this.props.hunch.id, accepted } });

  render(): React.Node {
    const { hunch, isBettor } = this.props;
    return (
      <DualAction
        canPerformPrimaryAction={!isBettor || differenceInDays(new Date(), hunch.lastRemindedAt) >= 2}
        canPerformSecondaryAction
        primaryAction={this.primaryAction}
        primaryLabel={isBettor ? 'Remind' : 'Accept'}
        primaryPlaceholder={`${hunch.lastRemindedAt === hunch.createdAt ? 'Created' : 'Reminded'} ${distanceInWordsToNow(hunch.lastRemindedAt, { addSuffix: true })}`}
        secondaryAction={this.secondaryAction}
        secondaryLabel={isBettor ? 'Cancel Hunch' : 'Decline'}
      />
    );
  }
}

export default compose(
  graphql(CANCEL_HUNCH_REQUEST, { name: 'cancel', options: props => ({ update: chain(onHunchCancel, props.onCancel || noop) }) }),
  graphql(REMIND_HUNCH_REQUEST, { name: 'remind' }),
  graphql(RESPOND_TO_HUNCH, { name: 'respond', options: { update: onHunchRespond } }),
)(HunchActions);

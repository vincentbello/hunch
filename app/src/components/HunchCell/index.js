// @flow
import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { distanceInWordsToNow } from 'date-fns';

import { type Hunch } from 'types/hunch';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import HunchActions from 'components/HunchActions';
import Image from 'components/Image';

const styles = StyleSheet.create({
  hunch: {
    backgroundColor: Colors.white,
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 2,
    alignItems: 'center',
  },
  image: {
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  link: {
    fontWeight: '800',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  labelText_green: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary.green,
  },
  labelText_red: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary.red,
  },
  labelSuperscript: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 1,
  },
  headerText: {
    flex: 1,
    color: Colors.textPrimary,
    marginRight: 4,
    ...Typography.base,
  },
  body: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  meta: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.primary.gray,
  },
  footer: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});

type Props = {
  hunch: Hunch,
  disabled: boolean,
  userId: number,
  onPress: () => void,
};

export default class HunchCell extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    onPress() {},
  };

  get displayedImageUrl(): string | null {
    if (this.isInvolved) return this.isBettor ? this.props.hunch.bettee.imageUrl : this.props.hunch.bettor.imageUrl;
    return this.props.hunch.bettor.imageUrl;
  }

  get isBettor(): boolean {
    return this.props.userId === this.props.hunch.bettor.id;
  }

  get isInvolved(): boolean {
    const { hunch, userId } = this.props;
    return userId === hunch.bettor.id || userId === hunch.bettee.id;
  }

  renderHunchAmount = (): React.Node => {
    const { hunch, userId } = this.props;
    const isComplete = hunch.winnerId !== null;
    const labelTextStyle = [styles.labelText, isComplete && styles[`labelText_${hunch.winnerId === userId ? 'green' : 'red'}`]];
    return (
      <React.Fragment>
        {hunch.winnerId !== null && <Text style={styles.labelText}>{hunch.winnerId === userId ? 'Won' : 'Lost'}</Text>}
        <Text style={styles.labelSuperscript}>$</Text>
        <Text style={labelTextStyle}>{hunch.amount}</Text>
      </React.Fragment>
    );
  };

  render(): React.Node {
    const { displayedImageUrl, isBettor, isInvolved } = this;
    const { hunch, disabled, onPress } = this.props;
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View style={styles.hunch}>
          <View style={styles.container}>
            <View style={styles.image}>
              <Image bordered rounded url={displayedImageUrl} />
            </View>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerText}>
                  {isInvolved && isBettor ? <Text>You</Text> : <Text style={styles.link}>{hunch.bettor.firstName}</Text>}
                  <Text> challenged </Text>
                  {isInvolved && !isBettor ? <Text>you</Text> : <Text style={styles.link}>{hunch.bettee.firstName}</Text>}
                </Text>
                <View style={styles.label}>{this.renderHunchAmount()}</View>
              </View>
              <Text style={styles.body} numberOfLines={2}>{hunch.wager}</Text>
              <Text style={styles.meta}>{distanceInWordsToNow(hunch.createdAt, { addSuffix: true })}</Text>
            </View>
          </View>
          {!hunch.responded && (
            <View style={styles.footer}>
              <HunchActions hunch={hunch} isBettor={isBettor} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

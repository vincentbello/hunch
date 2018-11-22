// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { distanceInWordsToNow, differenceInDays } from 'date-fns';

import { type Message } from 'types/message';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import Image from 'components/Image';

const s = StyleSheet.create({
  message: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  message_byMe: {
    justifyContent: 'flex-end',
  },
  content: {
    padding: 8,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 8,
    marginLeft: 8,
    textAlign: 'left',
    // TODO: How to properly wrap text?
  },
  content_byMe: {
    backgroundColor: Colors.brand.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 2,
    marginLeft: 0,
    marginRight: 8,
    textAlign: 'right',
  },
  contentText: {
    color: Colors.textPrimary,
  },
  contentText_byMe: {
    color: Colors.white,
  },
});

type Props = {
  byMe: boolean,
  message: Message,
};

const FeedMessage = ({ byMe, message }: Props): React.Node => {
  const image = <Image bordered rounded size="xsmall" url={message.author.url} />;

  return (
    <View style={[s.message, byMe && s.message_byMe]}>
      {!byMe && image}
      <View style={[s.content, byMe && s.content_byMe]}>
        <Text style={[s.contentText, byMe && s.contentText_byMe]}>{message.content}</Text>
      </View>
      {byMe && image}
    </View>
  )
};

FeedMessage.defaultProps = { byMe: false };
export default FeedMessage;

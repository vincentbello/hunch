// @flow
import * as React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { graphql } from 'react-apollo';
import GET_FAVORITE_TEAMS from 'graphql/queries/getFavoriteTeams';

import { type Team } from 'types/Team';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import Icon from 'react-native-vector-icons/Feather';

import DerivedStateSplash from 'components/DerivedStateSplash';
import Image from 'components/Image';

const styles = StyleSheet.create({
  empty: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  favorites: {
    flexGrow: 0,
    paddingLeft: 4,
  },
  favorites_padded: {
    paddingTop: 12,
  },
  favorite: {
    width: 80,
    marginLeft: 4,
    marginRight: 8,
    padding: 6,
    backgroundColor: Colors.white,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favorite_padded: {
    marginRight: 16,
  },
  favoriteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: Colors.primary.red,
    position: 'absolute',
    top: -12,
    right: -12,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

type Props = {
  editMode: boolean,
  favoriteTeamsQuery: {
    loading: boolean,
    error: Error,
    favoriteTeams: Array<Team>,
  },
  mine: boolean,
  userId: number | null,
  remove: (teamId: number) => void,
};

const FavoritesList = ({ editMode, favoriteTeamsQuery: { loading, error, favoriteTeams }, mine, userId, remove }): React.Node => (
  <DerivedStateSplash size="small" loading={loading} error={error}>
    {Boolean(favoriteTeams) && (
      favoriteTeams.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{editMode ? 'Add favorite teams below.' : 'No favorite teams.'}</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={favoriteTeams}
          showsHorizontalScrollIndicator={false}
          style={[styles.favorites, editMode && styles.favorites_padded]}
          keyExtractor={(team: Team): string => `${team.id}`}
          renderItem={({ item }: { item: Team }): React.Node => (
            <View style={[styles.favorite, editMode && styles.favorite_padded]}>
              {editMode && (
                <TouchableHighlight
                  style={styles.favoriteButton}
                  underlayColor={`${Colors.primary.red}80`}
                  onPress={(): void => remove(item.id)}
                >
                  <Icon
                    color={Colors.white}
                    style={styles.favoriteButtonIcon}
                    name="minus"
                    size={18}
                  />
                </TouchableHighlight>
              )}
              <Image rounded url={item.imageUrl} />
              <Text style={styles.favoriteLabel}>{item.abbreviation}</Text>
            </View>
          )}
        />
      )
    )}
  </DerivedStateSplash>
);

export default graphql(GET_FAVORITE_TEAMS, {
  name: 'favoriteTeamsQuery',
  options: ({ userId }: Props) => ({ variables: { userId } }),
})(FavoritesList);

// @flow
import * as React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { compose, graphql, Query } from 'react-apollo';
import GET_TEAMS from 'graphql/queries/getTeams';
import REMOVE_FAVORITE from 'graphql/mutations/removeFavorite';
import SET_FAVORITE from 'graphql/mutations/setFavorite';
import { LEAGUE_VIEW_TYPES } from 'constants/view-types';

import { type Team } from 'types/Team';

import Colors from 'theme/colors';

import Icon from 'react-native-vector-icons/FontAwesome';

import DerivedStateSplash from 'components/DerivedStateSplash';
import Image from 'components/Image';
import Splash from 'components/Splash';

type Props = {
  removeFavorite: ({ variables: { entity: string, entityId: number } }) => void,
  setFavorite: ({ variables: { entity: string, entityId: number } }) => void,
};

type State = {
  viewIndex: number,
};

const styles = StyleSheet.create({
  team: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.cellBorder,
    paddingLeft: 8,
    paddingRight: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  teamLabel: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  teamLabel_strong: {
    fontWeight: 'bold',
  },
});

class FavoritesContainer extends React.Component<Props, State> {
  static displayName = 'FavoritesContainer';

  state = {
    viewIndex: 0,
  };

  getTeamPressHandler = (team: Team): (() => void) => () => {
    const action = team.favorite ? 'removeFavorite' : 'setFavorite';
    this.props[action]({
      optimisticResponse: {
        [action]: { ...team, favorite: !team.favorite },
      },
      variables: { entity: 'Team', entityId: team.id },
    });
  };

  renderTeam = (team: Team): React.Node => (
    <TouchableOpacity style={styles.team} onPress={this.getTeamPressHandler(team)}>
      <Image rounded size="small" url={team.imageUrl} />
      <Text style={styles.teamLabel}>
        {team.firstName}
        {' '}
        <Text style={styles.teamLabel_strong}>{team.lastName}</Text>
      </Text>
      <Icon name={team.favorite ? 'star' : 'star-o'} color={team.favorite ? Colors.primary.orange : Colors.textSecondary} size={22} />
    </TouchableOpacity>
  );

  renderTeams = (teams: Array<Team>): React.Node => {
    if (teams.length === 0) return <Splash heading="No teams in this league." iconName="search" />;
    return (
      <FlatList
        data={teams}
        keyExtractor={(team: Team): string => `${team.id}`}
        renderItem={({ item }): React.Node => this.renderTeam(item)}
      />
    );
  };

  render(): React.Node {
    return (
      <Query query={GET_TEAMS} variables={{ league: LEAGUE_VIEW_TYPES[this.state.viewIndex].key }}>
        {({ loading, error, data: { teams } }): React.Node => (
          <DerivedStateSplash loading={loading} error={error}>
            {Boolean(teams) && this.renderTeams(teams)}
          </DerivedStateSplash>
        )}
      </Query>
    );
  }
}

export default compose(
  graphql(REMOVE_FAVORITE, { name: 'removeFavorite' }),
  graphql(SET_FAVORITE, { name: 'setFavorite' }),
)(FavoritesContainer);

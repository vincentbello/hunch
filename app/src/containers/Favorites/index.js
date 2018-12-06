// @flow
import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { compose, graphql, Query } from 'react-apollo';
import GET_TEAMS from 'graphql/queries/getTeams';
import REMOVE_FAVORITE_TEAM from 'graphql/mutations/removeFavoriteTeam';
import SET_FAVORITE_TEAM from 'graphql/mutations/setFavoriteTeam';
import { LEAGUE_VIEW_TYPES } from 'constants/view-types';

import { type Team } from 'types/Team';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

import Icon from 'react-native-vector-icons/FontAwesome';

import DerivedStateSplash from 'components/DerivedStateSplash';
import FavoritesList from 'components/FavoritesList';
import Image from 'components/Image';
import Splash from 'components/Splash';
import TabView from 'components/TabView';

type Props = {
  removeFavoriteTeam: ({ variables: { teamId: number } }) => void,
  setFavoriteTeam: ({ variables: { teamId: number } }) => void,
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
  sectionHeader: {
    ...Typography.h4,
    fontWeight: '900',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 2,
  },
});

class FavoritesContainer extends React.Component<Props, State> {
  static displayName = 'FavoritesContainer';

  state = {
    viewIndex: 0,
  };

  getTeamPressHandler = (team: Team): (() => void) => () => {
    const action = team.isFavorite ? 'removeFavoriteTeam' : 'setFavoriteTeam';
    this.props[action]({
      optimisticResponse: {
        [action]: { ...team, isFavorite: !team.isFavorite },
      },
      variables: { teamId: team.id },
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
      <Icon name={team.isFavorite ? 'star' : 'star-o'} color={team.isFavorite ? Colors.primary.orange : Colors.textSecondary} size={22} />
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

  renderTeamsQuery = (): React.Node => (
    <Query query={GET_TEAMS} variables={{ league: LEAGUE_VIEW_TYPES[this.state.viewIndex].key }}>
      {({ loading, error, data: { teams } }): React.Node => (
        <DerivedStateSplash loading={loading} error={error}>
          {Boolean(teams) && this.renderTeams(teams)}
        </DerivedStateSplash>
      )}
    </Query>
  );

  render(): React.Node {
    return (
      <React.Fragment>
        <Text style={styles.sectionHeader}>My Favorite Teams</Text>
        <FavoritesList editMode mine remove={(teamId: number): void => this.props.removeFavoriteTeam({ variables: { teamId } })} />
        <Text style={styles.sectionHeader}>Teams</Text>
        <TabView
          navigationState={{
            index: this.state.viewIndex,
            routes: LEAGUE_VIEW_TYPES,
          }}
          onIndexChange={(viewIndex: number): void => this.setState({ viewIndex })}
          renderScene={this.renderTeamsQuery}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(REMOVE_FAVORITE_TEAM, { name: 'removeFavoriteTeam', options: { refetchQueries: ['GetFavoriteTeams'] } }),
  graphql(SET_FAVORITE_TEAM, { name: 'setFavoriteTeam', options: { refetchQueries: ['GetFavoriteTeams'] } }),
)(FavoritesContainer);

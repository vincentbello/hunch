#!/usr/bin/env node
import 'dotenv/config';
import debugModule from 'debug';
import http from 'http';
import minimist from 'minimist';
const debug = debugModule('node-api:server');

import XmlStatsClient from '../../third-party/xml-stats';
import models from '../../db/models';

const argv = minimist(process.argv.slice(2));
const league = argv.league || 'NBA';
const seedTeamIds = ['golden-state-warriors', 'los-angeles-lakers'];
const now = new Date();

XmlStatsClient.fetchTeams(league)
  .then(teams => {
    const teamRows = teams.reduce((rows, team) => {
      if (seedTeamIds.includes(team.team_id)) return rows;

      return [...rows, {
        abbreviation: team.abbreviation,
        firstName: team.first_name,
        lastName: team.last_name,
        imageUrl: `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/${team.abbreviation.toLowerCase()}.png&h=70&w=70`,
        league: league.toUpperCase(),
        conference: team.conference,
        division: team.division,
        site: team.site_name,
        city: team.city,
        state: team.state,
        xmlStatsId: team.team_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
    }, []);
    models.Team.bulkCreate(teamRows)
      .then(createdTeams => console.log(`Created ${createdTeams.length} teams.`))
      .catch(err => console.error('Error creating rows', err));
  })
  .catch(err => console.error('Error fetching teams', err));

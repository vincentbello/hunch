import axios from 'axios';
import { stringify } from 'qs';
import nodeCache from 'node-cache';

// Cache responses for 10 minutes
const cache = new nodeCache({ stdTTL: 10 * 60 });

const axiosClient = axios.create({
  baseURL: 'https://erikberg.com',
  headers: {
    'Accept-Encoding': 'gzip',
    Authorization: `Bearer ${process.env.XML_STATS_ACCESS_TOKEN}`,
    'User-Agent': `xmlstats-exnode/${process.env.XML_STATS_API_VERSION} (${process.env.XML_STATS_USER_EMAIL})`,
  },
});

const defaultConfig = {
  sport: undefined,
  endpoint: undefined,
  id: undefined,
  params: {},
};

function buildUrl(config) {
  const { endpoint, format, id, params, sport } = { ...defaultConfig, ...config };
  const path = [sport.toLowerCase(), endpoint, id].filter(el => el !== undefined).join('/');
  return `/${path}.json${Object.keys(params).length > 0 ? `?${stringify(params)}` : ''}`;
}

export default class XmlStatsClient {
  static get(url) {
    const data = cache.get(url);
    if (data) return Promise.resolve(data);

    return new Promise((resolve, reject) => {
      axiosClient.get(url)
        .then(payload => {
          cache.set(url, payload.data);
          resolve(payload.data);
        })
        .catch(reject);
    });
  }

  static fetchGame(league, gameId) {
    return XmlStatsClient.get(buildUrl({ sport: league, endpoint: 'boxscore', id: gameId }));
  }

  static fetchGames(league, teamId, season) {
    return XmlStatsClient.get(buildUrl({ sport: league, endpoint: 'results', id: teamId, params: { season } }));
  }

  static fetchTeams(league) {
    return XmlStatsClient.get(buildUrl({ sport: league, endpoint: 'teams' }));
  }
}

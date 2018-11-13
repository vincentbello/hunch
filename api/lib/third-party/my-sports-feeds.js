import MySportsFeeds from 'mysportsfeeds-node';

const client = new MySportsFeeds('2.0', true);
client.authenticate(process.env.MY_SPORTS_FEEDS_ACCESS_TOKEN, 'MYSPORTSFEEDS');
export default client;

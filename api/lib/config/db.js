module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'hunch_development',
    host: 'localhost',
    dialect: 'mysql',
  },
  test: {
    dialect: 'mysql',
    storage: ':memory:'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql'
  }
};

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
    username: 'foo', // process.env.DB_USERNAME,
    password: 'bar', // process.env.DB_PASSWORD,
    database: 'baz', // process.env.DB_NAME,
    host: 'quux', // process.env.DB_HOSTNAME,
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL'
  }
};

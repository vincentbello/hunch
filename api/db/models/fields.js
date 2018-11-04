const { default: models, getModelDirs } = require('./');

module.exports = getModelDirs().reduce(({ queries, mutations }, model) => ({
  queries: {
    ...queries,
    ...require(`./${model}/queries`).default(models),
  },
  mutations: {
    ...mutations,
    ...require(`./${model}/mutations`).default(models),
  },
}), { queries: {}, mutations: {} });

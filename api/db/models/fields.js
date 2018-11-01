const { default: models, getModelDirs } = require('./');

module.exports = getModelDirs().reduce(({ queries, mutations }, model) => ({
  queries: {
    ...require(`./${model}/queries`).default(models),
    ...queries,
  },
  mutations: {},
}), { queries: {}, mutations: {} });

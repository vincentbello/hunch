import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
import dbConfig from '../../config/db';
const config = dbConfig[env];
const MODEL_DIR_REGEX = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/;

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export const getModelDirs = () => fs.readdirSync(__dirname).filter(dir => MODEL_DIR_REGEX.test(dir));

getModelDirs()
  .map(dir => path.join(dir, 'index.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

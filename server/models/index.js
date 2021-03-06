"use strict";

// var fs        = require('fs');
// var path      = require('path');
var Sequelize = require("sequelize");
//var basename  = path.basename(__filename);
//var env       = process.env.NODE_ENV || 'development';
//var config    = require(__dirname + '/../config/config.js')[env];
var db = {};

//if (config.use_env_variable) {
//  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
//} else {
var sequelize = new Sequelize(
  //   config.database,
  //   config.username,
  //   config.password,
  //   config
  "slack",
  "postgres",
  "postgres",
  {
    host: "localhost",
    logging: false,
    dialect: "postgres",
    define: { underscored: true },
  }
);
//}

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });
var models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  DirectMessage: sequelize.import("./directMessage"),
  User_Team: sequelize.import("./user_team"),
  User_Channel: sequelize.import("./user_channel"),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;

"use strict";
module.exports = (sequelize) => {
  var User_team = sequelize.define("user_team", {}, { freezeTableName: true });

  return User_team;
};

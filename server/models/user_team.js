"use strict";
module.exports = (sequelize) => {
  var User_Team = sequelize.define("user_team", {}, { freezeTableName: true });

  return User_Team;
};

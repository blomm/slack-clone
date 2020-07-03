"use strict";
module.exports = (sequelize) => {
  var User_channel = sequelize.define(
    "user_channel",
    {},
    { freezeTableName: true }
  );

  return User_channel;
};

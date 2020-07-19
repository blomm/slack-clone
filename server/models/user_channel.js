"use strict";
module.exports = (sequelize) => {
  var User_Channel = sequelize.define(
    "user_channel",
    {},
    { freezeTableName: true }
  );

  return User_Channel;
};

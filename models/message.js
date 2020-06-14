"use strict";
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "message",
    {
      text: { type: DataTypes.STRING },
    },
    { underscored: true }
  );

  // we've describe the associate in
  // the user and channel
  // Message.associate = function (models) {
  // this will be a 1:1
  //models.message.hasOne(models.user);
  // this will be a one to one
  //models.message.hasOne(models.channel);
  //};

  return Message;
};

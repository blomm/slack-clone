"use strict";
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define("message", {
    text: { type: DataTypes.STRING },
  });

  // we've describe the associate in
  // the user and channel
  Message.associate = function (models) {
    Message.belongsTo(models.Channel);
    // , {
    //   foreignKey: {
    //     name: 'channelId',
    //     field: 'channel_id',
    //   },
    // });
    Message.belongsTo(models.User);
    //   {
    //   foreignKey: {
    //     name: 'userId',
    //     field: 'user_id',
    //   },
    // });
    // //this will be a 1:1
    // models.Message.hasOne(models.User);
    // //this will be a one to one
    // models.Message.hasOne(models.Channel);
  };

  return Message;
};

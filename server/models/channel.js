"use strict";
module.exports = (sequelize, DataTypes) => {
  var Channel = sequelize.define("channel", {
    name: { type: DataTypes.STRING },
    public: { type: DataTypes.BOOLEAN },
  });

  Channel.associate = function (models) {
    // models.channel.hasOne(models.team);
    // this is a 1:M
    models.channel.hasMany(models.message);

    // M:M
    models.channel.belongsToMany(models.user, { through: models.user_channel });
  };

  return Channel;
};

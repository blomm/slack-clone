"use strict";
module.exports = (sequelize, DataTypes) => {
  var Channel = sequelize.define("channel", {
    name: { type: DataTypes.STRING },
    public: { type: DataTypes.BOOLEAN },
  });

  Channel.associate = function (models) {
    // models.Channel.hasOne(models.Team);
    // this is a 1:M
    models.Channel.hasMany(models.Message);

    // M:M
    models.Channel.belongsToMany(models.User, { through: models.User_Channel });
  };

  return Channel;
};

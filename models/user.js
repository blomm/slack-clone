"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "user",
    {
      username: { type: DataTypes.STRING, unique: true },
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
    },
    { underscored: true }
  );

  User.associate = function (models) {
    // M:M
    models.user.belongsToMany(models.team, { through: "user_team" });

    // M:M
    models.user.belongsToMany(models.channel, { through: "user_channel" });

    // 1:M
    models.user.hasMany(models.message);

    // this will add a 'owner' field to teams
    // with a reference to userId
    models.user.hasOne(models.team, { as: "owner" });
  };

  return User;
};

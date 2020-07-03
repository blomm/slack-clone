"use strict";
module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define("team", {
    name: { type: DataTypes.STRING, unique: true },
  });

  Team.associate = function (models) {
    // this will be a many to many
    models.team.belongsToMany(models.user, { through: models.user_team });
    // this will be a one to one
    // models.team.hasOne(models.user, { as: "owner" });
    // this will be a one to many
    models.team.hasMany(models.channel);
    // this is defining the owner
    //models.team.belongsTo(models.user);
  };

  return Team;
};

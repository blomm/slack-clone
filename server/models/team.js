"use strict";
module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define("team", {
    name: { type: DataTypes.STRING, unique: true },
  });

  Team.associate = function (models) {
    // this will be a many to many
    models.Team.belongsToMany(models.User, { through: models.User_Team });
    // this will be a one to one
    // models.Team.hasOne(models.User, { as: "owner" });
    // this will be a one to many
    models.Team.hasMany(models.Channel);
    // this is defining the owner
    //models.Team.belongsTo(models.User);
  };

  return Team;
};

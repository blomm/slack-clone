"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The username must contain only letters or numbers",
        },
        len: {
          args: [3, 25],
          msg: "The username must be longer than 3 and less than 25 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      // validate: {
      //   len: {
      //     args: [6, 100],
      //     msg: "The password must be between 6 and 100 characters long",
      //   },
      // },
    },
  });

  User.associate = function (models) {
    // M:M
    models.user.belongsToMany(models.team, { through: "user_team" });

    // M:M
    models.user.belongsToMany(models.channel, { through: "user_channel" });

    // 1:M
    models.user.hasMany(models.message);

    // this will add a 'owner_id' field to teams
    // with a reference to userId
    models.user.hasOne(models.team, { foreignKey: "owner_id" });
  };

  return User;
};

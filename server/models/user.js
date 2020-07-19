const bcrypt = require("bcrypt");

("use strict");
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "user",
    {
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
            msg:
              "The username must be longer than 3 and less than 25 characters",
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
        validate: {
          len: {
            args: [5, 100],
            msg: "The password  must be between 5 and 100 characters",
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
    }
  );

  User.associate = function (models) {
    // M:M
    models.User.belongsToMany(models.Team, { through: models.User_Team });

    // M:M
    models.User.belongsToMany(models.Channel, { through: models.User_Channel });

    // 1:M
    models.User.hasMany(models.Message);

    // this will add a 'owner_id' field to teams
    // with a reference to userId
    models.User.hasOne(models.Team, { foreignKey: "owner_id" });
  };

  return User;
};

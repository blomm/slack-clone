"use strict";
module.exports = (sequelize, DataTypes) => {
  var DM = sequelize.define("directmessage", {
    text: { type: DataTypes.STRING },
  });

  DM.associate = function (models) {
    DM.belongsTo(models.User, { foreignKey: "to" });
    DM.belongsTo(models.User, { foreignKey: "from" });
    DM.belongsTo(models.Team);
  };

  return DM;
};

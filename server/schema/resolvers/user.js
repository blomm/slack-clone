const bcrypt = require("bcrypt");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allUsers: (_parent, _args, { models }, _server) => models.user.findAll(),
    user: (_parent, { id }, { models }, _server) =>
      models.user.findOne({ where: { id } }),
  },
  Mutation: {
    register: async (
      _parent,
      { password, ...otherArgs },
      { models },
      _server
    ) => {
      try {
        // hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 12);
        await models.user.create({ ...otherArgs, password: hashedPassword });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

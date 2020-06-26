const formatErrors = require("../formatErrors");
const { ApolloError } = require("apollo-server-express");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allTeams: (_parent, _args, { models }, _server) => models.team.findAll(),
    team: (_parent, { id }, { models }, _server) =>
      models.team.findOne({ where: { id } }),
  },
  Mutation: {
    createTeam: async (_parent, args, { models, user }, _server) => {
      {
        if (!user) throw new ApolloError("Not logged in", 401);

        try {
          await models.team.create({ ...args, owner_id: user.id });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error),
          };
        }
      }
    },
  },
};

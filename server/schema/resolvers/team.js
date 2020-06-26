const formatErrors = require("../formatErrors");
const { ApolloError } = require("apollo-server-express");
const { authenticated } = require("../guards/auth-guard");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allTeams: authenticated((_parent, _args, { models }, _server) =>
      models.team.findAll()
    ),
    team: authenticated((_parent, { id }, { models }, _server) =>
      models.team.findOne({ where: { id } })
    ),
  },
  Mutation: {
    createTeam: authenticated(
      async (_parent, args, { models, user }, _server) => {
        {
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
      }
    ),
  },
};

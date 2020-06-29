const formatErrors = require("../formatErrors");
const { ApolloError } = require("apollo-server-express");
const { authenticated } = require("../guards/auth-guard");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allTeams: authenticated((_parent, _args, { models, user }, _server) =>
      models.team.findAll({ where: { owner_id: user.id } })
    ),
    team: authenticated((_parent, { id }, { models }, _server) =>
      models.team.findOne({ where: { id } })
    ),
  },
  Team: {
    owner: (parent, _args, { models }, _server) =>
      models.user.findOne({ where: { id: parent.owner_id } }),
    channels: (parent, _args, { models }, _server) =>
      models.channel.findAll({ where: { team_id: parent.id } }),
    // users: (parent, _args, { models }, _server) =>
    //   models.user.findAll()
  },
  Mutation: {
    createTeam: authenticated(
      async (_parent, args, { models, user }, _server) => {
        {
          try {
            const newTeam = await models.team.create({
              ...args,
              owner_id: user.id,
            });
            await models.channel.create({
              name: "general",
              public: true,
              teamId: newTeam.id,
            });
            return {
              ok: true,
              team: newTeam,
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

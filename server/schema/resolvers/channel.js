const { authenticated, isTeamOwner } = require("../guards/auth-guard");
const { formatErrors } = require("../formatErrors");
// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    channel: authenticated((_parent, { id }, { models }, _server) =>
      models.Channel.findOne({ where: { id } })
    ),
    allChannels: authenticated((_parent, _args, { models }, _server) =>
      models.Channel.findAll()
    ),
  },
  Mutation: {
    createChannel: authenticated(
      isTeamOwner(async (_parent, args, { models }, _server) => {
        try {
          const channel = await models.Channel.create(args);
          return {
            response: true,
            channel,
          };
        } catch (error) {
          return {
            response: false,
            errors: formatErrors(error),
          };
        }
      })
    ),
  },
};

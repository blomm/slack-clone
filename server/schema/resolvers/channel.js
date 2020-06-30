const { authenticated } = require("../guards/auth-guard");
// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    channel: authenticated((_parent, { id }, { models }, _server) =>
      models.channel.findOne({ where: { id } })
    ),
    allChannels: authenticated((_parent, _args, { models }, _server) =>
      models.channel.findAll()
    ),
  },
  Mutation: {
    createChannel: authenticated(async (_parent, args, { models }, _server) => {
      try {
        await models.channel.create(args);
        return true;
      } catch (error) {
        return false;
      }
    }),
  },
};

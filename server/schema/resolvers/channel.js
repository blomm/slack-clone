// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    channel: (_parent, { id }, { models }, _server) =>
      models.channel.findOne({ where: { id } }),
    allChannels: (_parent, _args, { models }, _server) =>
      models.channel.findAll(),
  },
  Mutation: {
    createChannel: (_parent, args, { models }, _server) => {
      try {
        models.channel.create(args);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

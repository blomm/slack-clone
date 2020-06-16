// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    message: (_parent, { id }, { models }, _server) =>
      models.message.findOne({ where: { id } }),
    allMessages: (_parent, _args, { models }, _server) =>
      models.message.findAll(),
  },
  Mutation: {
    createMessage: (_parent, args, { models, user }, _server) => {
      try {
        models.message.create({ ...args, userId: user.id });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

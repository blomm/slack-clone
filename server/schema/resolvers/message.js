const { authenticated } = require("../guards/auth-guard");
// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    message: authenticated((_parent, { id }, { models }, _server) =>
      models.message.findOne({ where: { id } })
    ),
    channelMessages: authenticated(
      (_parent, { channelId }, { models }, _server) =>
        models.message.findAll({
          order: [["createdAt", "ASC"]],
          where: { channelId },
        })
    ),
  },
  Message: {
    user: (parent, _args, { models }, _server) =>
      models.user.findOne({ where: { id: parent.userId } }),
  },
  Mutation: {
    createMessage: authenticated(
      async (_parent, args, { models, user }, _server) => {
        try {
          await models.message.create({ ...args, userId: user.id });
          return true;
        } catch (error) {
          return false;
        }
      }
    ),
  },
};

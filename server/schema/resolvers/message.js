const { authenticated } = require("../guards/auth-guard");
// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    message: authenticated((_parent, { id }, { models }, _server) =>
      models.message.findOne({ where: { id } })
    ),
    allMessages: authenticated((_parent, _args, { models }, _server) =>
      models.message.findAll()
    ),
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

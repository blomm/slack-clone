const { authenticated } = require("../guards/auth-guard");
const { pubsub } = require("../pubsub");
const { ApolloError } = require("apollo-server-express");
const { withFilter } = require("apollo-server");

const MESSAGE_ADDED = "MESSAGE_ADDED";

// Provide resolver functions for your schema fields
module.exports = {
  Subscription: {
    messageAdded: {
      // Additional event labels can be passed to asyncIterator creation
      // subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(MESSAGE_ADDED);
        },
        (payload, args) => {
          console.log(
            `checking the filter: ${payload.channelId} and ${args.channelId} should match`
          );
          return payload.channelId === args.channelId;
        }
      ),
    },
  },
  Query: {
    message: authenticated((_parent, { id }, { models }, _server) =>
      models.message.findOne({ where: { id } })
    ),
    channelMessages: authenticated(
      (_parent, { channelId }, { models }, _server) =>
        models.message.findAll({
          order: [["createdAt", "DESC"]],
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
          const message = await models.message.create({
            ...args,
            userId: user.id,
          });
          console.log(
            `adding new message: ${JSON.stringify(message.dataValues)}`
          );
          //pubsub.publish(MESSAGE_ADDED, { messageAdded: args });
          pubsub.publish(MESSAGE_ADDED, {
            messageAdded: message.dataValues,
            channelId: args.channelId,
          });

          return true;
        } catch (error) {
          //throw new ApolloError(error);
          return false;
        }
      }
    ),
  },
};

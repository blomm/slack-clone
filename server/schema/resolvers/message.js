const {
  authenticated,
  isMemberOfChannelsTeam,
} = require("../guards/auth-guard");
const { pubsub } = require("../pubsub");
const { ApolloError } = require("apollo-server-express");
const { withFilter } = require("apollo-server");

const MESSAGE_ADDED = "MESSAGE_ADDED";

module.exports = {
  Subscription: {
    messageAdded: {
      subscribe: isMemberOfChannelsTeam(
        withFilter(
          () => {
            return pubsub.asyncIterator(MESSAGE_ADDED);
          },
          (payload, args) => {
            // the args are what are passed in as variables
            // in the subscribeToMore on the client side
            return payload.channelId === args.channelId;
          }
        )
      ),
    },
  },
  Query: {
    message: authenticated((_parent, { id }, { models }, _server) =>
      models.Message.findOne({ where: { id } })
    ),
    channelMessages: authenticated(
      (_parent, { channelId }, { models }, _server) =>
        models.Message.findAll({
          order: [["createdAt", "DESC"]],
          where: { channelId },
        })
    ),
  },
  Message: {
    user: (parent, _args, { models }, _server) =>
      models.User.findOne({ where: { id: parent.userId } }),
  },
  Mutation: {
    createMessage: authenticated(
      async (_parent, args, { models, user }, _server) => {
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id,
          });
          console.log(
            `adding new message: ${JSON.stringify(message.dataValues)}`
          );
          //pubsub.publish(MESSAGE_ADDED, { messageAdded: args });
          // the second parameter is the payload in the subscribe: withFilter above
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

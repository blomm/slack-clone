const { Op } = require("sequelize");
const { pubsub } = require("../pubsub");
const { withFilter } = require("apollo-server");
const { authenticated, isPartOfConversation } = require("../guards/auth-guard");

const DM_ADDED = "DM_ADDED";
module.exports = {
  Subscription: {
    directMessageAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: isPartOfConversation(
        withFilter(
          () => pubsub.asyncIterator([DM_ADDED]),
          ({ directMessageAdded }, args) => {
            // check if the message is between the two correct people
            if (
              directMessageAdded.to === args.myId &&
              directMessageAdded.from === args.recipientId
            ) {
              return true;
            } else if (
              directMessageAdded.from === args.myId &&
              directMessageAdded.to === args.recipientId
            ) {
              return true;
            }
            return false;
          }
        )
      ),
    },
  },
  Query: {
    directMessages: authenticated(
      async (_parent, args, { models, user }, _server) => {
        const DMs = await models.DirectMessage.findAll({
          where: {
            teamId: args.teamId,
            [Op.or]: [
              { [Op.and]: [{ to: user.id }, { from: args.recipientId }] },
              { [Op.and]: [{ to: args.recipientId }, { from: user.id }] },
            ],
          },
        });
        return DMs.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
    ),
  },
  DirectMessage: {
    from: (parent, _args, { models }, _server) =>
      models.User.findOne({ where: { id: parent.from } }),
  },
  Mutation: {
    createDirectMessage: authenticated(
      async (_parent, args, { models, user }, _server) => {
        try {
          let newDM = await models.DirectMessage.create({
            ...args,
            from: user.id,
          });
          pubsub.publish(DM_ADDED, { directMessageAdded: newDM.dataValues });
          return true;
        } catch (error) {
          return false;
        }
      }
    ),
  },
};

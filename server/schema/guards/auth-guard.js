const { ApolloError } = require("apollo-server-express");

module.exports = {
  authenticated: (next) => (parent, args, context, server) => {
    if (!context.user) {
      throw new ApolloError(`Not logged in`);
    }

    return next(parent, args, context, server);
  },
  validateRole: (role) => (next) => (parent, args, context, server) => {
    if (context.user.role !== role) {
      throw new ApolloError(`Unauthorized`);
    }

    return next(parent, args, context, server);
  },
  isPartOfConversation: (next) => (parent, args, { models, user }, server) => {
    if (user.id === args.myId || user.id === args.recipientId) {
      return next(parent, args, { models, user }, server);
    } else {
      throw new ApolloError(`Unauthorised to subscribe to this conversation`);
    }
  },
  // is a user a member of a given channel's team?
  isMemberOfChannelsTeam: (next) => async (
    parent,
    args,
    { models, user },
    server
  ) => {
    const team = await models.Channel.findOne({
      where: { id: args.channelId },
    });
    // check if user belongs to channel, and channel belongs to team
    const dbUser = await models.User_Team.findOne({
      where: { user_id: user.id, team_id: team.teamId },
    });
    if (!dbUser) {
      throw new ApolloError(`Unauthorised to subscribe to this channel`);
    }

    return next(parent, args, { models, user }, server);
  },
  isTeamOwner: (next) => async (parent, args, { models, user }, server) => {
    const team = await models.Team.findOne({ where: { id: args.teamId } });
    if (team.owner_id !== user.id) {
      throw new ApolloError(
        `User ${user.username} is not owner of team ${team.name}`
      );
    }

    return next(parent, args, { models, user }, server);
  },
};

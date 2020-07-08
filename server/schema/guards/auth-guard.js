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
  isTeamOwner: (next) => async (parent, args, { models, user }, server) => {
    const team = await models.team.findOne({ where: { id: args.teamId } });
    if (team.owner_id !== user.id) {
      throw new ApolloError(
        `User ${user.username} is not owner of team ${team.name}`
      );
    }

    return next(parent, args, { models, user }, server);
  },
};

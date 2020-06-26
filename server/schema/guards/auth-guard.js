module.exports = {
  authenticated: (next) => (parent, args, context, server) => {
    if (!context.user) {
      throw new Error(`Not logged in`);
    }

    return next(parent, args, context, server);
  },
  validateRole: role => next => (parent, args, context, server) => {
    if (context.user.role !== role) {
        throw new Error(`Unauthorized`);
    }
  
    return next(parent, args, context, server);
  };
};

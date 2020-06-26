module.exports = {
  authenticated: (next) => (parent, args, context, server) => {
    if (!context.user) {
      throw new Error(`Not logged in`);
    }

    return next(parent, args, context, server);
  },
};

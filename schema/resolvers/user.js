// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allUsers: (_parent, _args, { models }, _server) => models.user.findAll(),
    user: (_parent, { id }, { models }, _server) =>
      models.user.findOne({ where: { id } }),
  },
  Mutation: {
    createUser: (_parent, args, { models }, _server) =>
      models.user.create(args),
  },
};

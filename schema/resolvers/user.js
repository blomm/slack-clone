// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    users: (_parent, _args, _context, _server) => "Hey users!!",
  },
};

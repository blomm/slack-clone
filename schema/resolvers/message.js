// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    messages: (_parent, _args, _context, _server) => "Hey messages!!",
  },
};

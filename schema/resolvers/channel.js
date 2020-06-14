// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    channels: (_parent, _args, _context, _server) => "Hey channels!!",
  },
};

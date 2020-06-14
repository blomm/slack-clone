// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    hello: (_parent, _args, _context, _server) => "Hey world!!",
  },
};

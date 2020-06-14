// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    teams: (_parent, _args, _context, _server) => "Hey teams!!",
  },
};

const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }

  type Query {
    teams: String
  }
`;

const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type Channel {
    id: Int!
    name: String!
    pulic: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type Mutation {
    createChannel(
      name: String!
      public: Boolean = false
      teamId: Int!
    ): Boolean!
  }

  type Query {
    allChannels: [Channel!]!
    channel(id: Int!): Channel!
  }
`;

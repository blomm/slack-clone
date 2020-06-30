const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type CreateChannelResponse {
    response: Boolean!
    channel: Channel
    errors: [Error]
  }

  type Mutation {
    createChannel(
      name: String!
      public: Boolean = false
      teamId: Int!
    ): CreateChannelResponse!
  }

  type Query {
    allChannels: [Channel!]!
    channel(id: Int!): Channel!
  }
`;

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

  type Channel {
    id: Int!
    name: String!
    pulic: Boolean!
    messages: [Message!]!
  }

  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
  }

  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }
  type Query {
    hello: String
  }
`;

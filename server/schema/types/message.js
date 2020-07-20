const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel
    createdAt: String!
  }

  type Subscription {
    messageAdded(channelId: Int!): Message
  }

  type Query {
    channelMessages(channelId: Int!): [Message!]
    message(id: Int!): Message!
  }

  type Mutation {
    createMessage(text: String!, channelId: Int): Boolean!
  }
`;

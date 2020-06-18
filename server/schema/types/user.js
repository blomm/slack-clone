const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    allUsers: [User!]!
    user(id: Int!): User!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
  }
`;

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
    me: User!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    authToken: String
    refreshToken: String
    errors: [Error!]
  }

  type LoginResponse {
    authToken: String!
    refreshToken: String!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
  }
`;

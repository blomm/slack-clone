const { gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type Team {
    id: Int!
    name: String!
    owner: User
    members: [User!]
    channels: [Channel!]
  }

  type CreateTeamResponse {
    ok: Boolean!
    team: Team
    errors: [Error!]
  }

  type NewUserInTeamResponse {
    ok: Boolean!
    errors: [Error!]
    userTeam: UserTeam
  }

  type UserTeam {
    user_id: Int!
    team_id: Int!
  }

  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    addUserToTeam(email: String!, teamId: Int!): NewUserInTeamResponse!
  }

  type Query {
    allTeams: [Team!]!
    team(id: Int!): Team!
  }
`;

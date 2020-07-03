import gql from "graphql-tag";

export const GET_TEAMS = gql`
  {
    allTeams {
      id
      name
      owner {
        email
      }
      channels {
        id
        name
      }
    }
  }
`;

export const ADD_USER_TO_TEAM = gql`
  mutation addUserToTeam($email: String!, $teamId: Int!) {
    addUserToTeam(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

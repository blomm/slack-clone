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

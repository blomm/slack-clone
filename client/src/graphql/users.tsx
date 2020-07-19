import gql from "graphql-tag";

export const ME = gql`
  {
    me {
      id
      username
      email
      teams {
        id
        name
        owner {
          id
          email
        }
        members {
          id
          username
          email
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      authToken
      refreshToken
    }
  }
`;

export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      authToken
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

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

import gql from "graphql-tag";

export const CREATE_CHANNEL = gql`
  mutation createChannel($name: String!, $teamId: Int!, $public: Boolean) {
    createChannel(name: $name, public: $public, teamId: $teamId) {
      response
      channel {
        name
        id
        public
      }
      errors {
        path
        message
      }
    }
  }
`;

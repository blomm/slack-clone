import gql from "graphql-tag";

export const CREATE_DIRECT_MESSAGE = gql`
  mutation createDirectMessage($text: String!, $teamId: Int!, $to: Int!) {
    createDirectMessage(text: $text, teamId: $teamId, to: $to)
  }
`;

export const GET_DIRECT_MESSAGES = gql`
  query($recipientId: Int!, $teamId: Int!) {
    directMessages(recipientId: $recipientId, teamId: $teamId) {
      id
      text
      from {
        username
      }
      createdAt
    }
  }
`;

export const DIRECT_MESSAGES_SUBSCRIPTION = gql`
  subscription directMessageAdded($myId: Int!, $recipientId: Int!) {
    directMessageAdded(myId: $myId, recipientId: $recipientId) {
      id
      text
      from {
        username
      }
      createdAt
    }
  }
`;

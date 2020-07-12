import gql from "graphql-tag";

export const CREATE_MESSAGE = gql`
  mutation createMessage($text: String!, $channelId: Int!) {
    createMessage(text: $text, channelId: $channelId)
  }
`;

export const GET_CHANNEL_MESSAGES = gql`
  query channelMessages($channelId: Int!) {
    channelMessages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

import gql from "graphql-tag";

export const CREATE_MESSAGE = gql`
  mutation createMessage($text: String!, $channelId: Int!) {
    createMessage(text: $text, channelId: $channelId)
  }
`;

export const GET_MESSAGES_FOR_CHANNEL = gql`
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

export const MESSAGES_SUBSCRIPTION = gql`
  subscription messageAdded($channelId: Int!) {
    messageAdded(channelId: $channelId) {
      id
      text

      createdAt
    }
  }
`;

// export const MESSAGES_SUBSCRIPTION = gql`
//   subscription messageAdded($channelId: Int!) {
//     messageAdded(channelId: $channelId) {
//       id
//       text
//       user {
//         username
//       }
//       createdAt
//     }
//   }
// `;

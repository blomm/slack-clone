const { gql } = require("apollo-server-express");

module.exports = gql`
  type DirectMessage {
    id: Int!
    text: String!
    to: User!
    from: User!
    createdAt: String!
  }

  type Subscription {
    directMessageAdded(myId: Int!, recipientId: Int!): DirectMessage
  }

  type Query {
    directMessages(recipientId: Int!, teamId: Int!): [DirectMessage!]
  }

  type Mutation {
    createDirectMessage(text: String!, teamId: Int!, to: Int!): Boolean!
  }
`;

// const CREATE_DIRECT_MESSAGE = gql`
//   mutation ($text: String!, $to: Int!){
//     createDirectMessage(text: $text, to: $to){

//     }
//   }
// `

// const SELECT_DIRECT_MESSAGES = gql``

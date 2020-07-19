import React from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_MESSAGES_FOR_CHANNEL,
  MESSAGES_SUBSCRIPTION,
} from "../graphql/messages";
import { Comment } from "semantic-ui-react";
import styled from "styled-components";
import {
  GET_DIRECT_MESSAGES,
  DIRECT_MESSAGES_SUBSCRIPTION,
} from "../graphql/directMessages";
import { ME } from "../graphql/users";

const StyledComment = styled(Comment)`
  padding-bottom: 10px;
`;

const MessagesWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

// export const Messages: React.FC = ({ children }) => {
//   return <MessagesWrapper>{children}</MessagesWrapper>;
// };

export const DirectMessages = ({ recipientId, teamId }) => {
  const { data: userData } = useQuery(ME);

  const { data, error, loading, subscribeToMore } = useQuery(
    GET_DIRECT_MESSAGES,
    {
      variables: { recipientId, teamId },
      fetchPolicy: "network-only",
    }
  );

  const subscribeToNewComments = () => {
    console.log(`myId is ${userData.me.id} and recipientId is ${recipientId} `);
    return subscribeToMore({
      document: DIRECT_MESSAGES_SUBSCRIPTION,
      variables: { myId: userData.me.id, recipientId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        return Object.assign({}, prev, {
          directMessages: [
            subscriptionData.data.directMessageAdded,
            ...prev.directMessages,
          ],
        });
      },
    });
  };

  React.useEffect(() => {
    let unsub = subscribeToNewComments();
    return () => {
      unsub();
    };
  }, [recipientId]);

  if (error) {
    return <div>error</div>;
  }
  if (loading) {
    return <div>...loading</div>;
  }

  return (
    <MessagesWrapper>
      {data && data.directMessages
        ? data.directMessages.map((m, index) => (
            <StyledComment key={index}>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as="a">{m.from.username}</Comment.Author>
                <Comment.Metadata>
                  <div>
                    {new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    }).format(m.createdAt)}
                  </div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                {/* <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions> */}
              </Comment.Content>
            </StyledComment>
          ))
        : null}
    </MessagesWrapper>
  );
};

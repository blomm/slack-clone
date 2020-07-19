import React from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_MESSAGES_FOR_CHANNEL,
  MESSAGES_SUBSCRIPTION,
} from "../graphql/messages";
import { Comment } from "semantic-ui-react";
import styled from "styled-components";

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

export const ChannelMessages = ({ channelId }) => {
  const { data, error, loading, subscribeToMore } = useQuery(
    GET_MESSAGES_FOR_CHANNEL,
    {
      variables: { channelId },
      fetchPolicy: "network-only",
    }
  );

  const subscribeToNewComments = () =>
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        return Object.assign({}, prev, {
          channelMessages: [
            subscriptionData.data.messageAdded,
            ...prev.channelMessages,
          ],
        });
      },
    });

  React.useEffect(() => {
    let unsub = subscribeToNewComments();
    return () => {
      unsub();
    };
  }, [channelId]);

  if (error) {
    return <div>error</div>;
  }
  if (loading) {
    return <div>...loading</div>;
  }

  return (
    <MessagesWrapper>
      {data && data.channelMessages
        ? data.channelMessages.map((m, index) => (
            <StyledComment key={index}>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as="a">{m.user.username}</Comment.Author>
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

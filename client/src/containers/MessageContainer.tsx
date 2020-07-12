import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHANNEL_MESSAGES } from "../graphql/messages";
import { Messages } from "../layout/Messages";
import { Button, Comment, Form, Header } from "semantic-ui-react";

export const MessageContainer = ({ channelId }) => {
  const { data, error, loading } = useQuery(GET_CHANNEL_MESSAGES, {
    variables: { channelId },
  });
  if (error) {
    return <div>error</div>;
  }
  if (loading) {
    return <div>...loading</div>;
  }
  return (
    <Messages>
      {data && data.channelMessages
        ? data.channelMessages.map((m, index) => (
            <Comment key={index}>
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
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))
        : null}
    </Messages>
  );
};

import React from "react";
import { ChannelMessages } from "./ChannelMessages";
import SendMessage from "../layout/SendMessage";
import { RouteComponentProps } from "react-router-dom";
import Header from "../layout/Header";
import { useMutation } from "@apollo/client";
import { CREATE_MESSAGE } from "../graphql/messages";

interface MessageContainerProps extends RouteComponentProps {
  channels: any;
}

export const ChannelMessageContainer: React.FC<MessageContainerProps> = ({
  match: { params },
  channels,
}) => {
  const [createMessage] = useMutation(CREATE_MESSAGE);

  const channelInt = parseInt((params as any).channelId, 10);

  const channel = channels.find((c) => c.id === channelInt)
    ? channels.find((c) => c.id === channelInt)
    : channels[0];
  return (
    <>
      <Header titletext={channel.name} />
      <ChannelMessages channelId={channel.id} />
      <SendMessage
        placeholder={channel.name}
        messageSubmitted={async (data, e) => {
          await createMessage({
            variables: {
              text: data.messageInput,
              channelId: channel.id,
            },
          });
          // https://react-hook-form.com/api#reset
          e.target.reset();
        }}
      ></SendMessage>
    </>
  );
};

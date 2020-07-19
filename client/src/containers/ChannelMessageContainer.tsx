import React from "react";
import { ChannelMessages } from "./ChannelMessages";
import SendMessage from "../layout/SendMessage";
import { RouteComponentProps } from "react-router-dom";
import Header from "../layout/Header";

interface MessageContainerProps extends RouteComponentProps {
  channels: any;
}

export const ChannelMessageContainer: React.FC<MessageContainerProps> = ({
  match: { params },
  channels,
}) => {
  const channelInt = parseInt((params as any).channelId, 10);

  const channel = channels.find((c) => c.id === channelInt)
    ? channels.find((c) => c.id === channelInt)
    : channels[0];
  return (
    <>
      <Header titletext={channel.name} />
      <ChannelMessages channelId={channel.id} />
      <SendMessage
        channelname={channel.name}
        channelId={channel.id}
      ></SendMessage>
    </>
  );
};

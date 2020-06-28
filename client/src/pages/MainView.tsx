import React from "react";
import { AppLayout } from "../layout/AppLayout";
import { Teams } from "../layout/Teams";
import { Channels } from "../layout/Channels";
import Header from "../layout/Header";
import { Messages } from "../layout/Messages";
import SendMessage from "../layout/SendMessage";

export const MainView = () => {
  return (
    <AppLayout>
      <Teams
        teams={[
          { id: 1, letter: "B" },
          { id: 2, letter: "T" },
        ]}
      ></Teams>
      <Channels
        teamName="Team 1"
        userName="User 1"
        users={[
          { id: 1, name: "slackbot" },
          { id: 2, name: "user 2" },
        ]}
        channels={[
          { id: 1, name: "general" },
          { id: 2, name: "random" },
        ]}
      ></Channels>
      <Header channelName="general">Header</Header>
      <Messages>
        <ul>
          <li>first item</li>
          <li>second item</li>
        </ul>
      </Messages>
      <SendMessage channelName="general"></SendMessage>
    </AppLayout>
  );
};

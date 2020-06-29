import React from "react";
import { AppLayout } from "../layout/AppLayout";
import Header from "../layout/Header";
import { Messages } from "../layout/Messages";
import SendMessage from "../layout/SendMessage";
import { SideBar } from "../containers/SideBar";

export const MainView = ({ match: { params } }) => {
  return (
    <AppLayout>
      <SideBar currentTeam={params.teamId}></SideBar>
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

import React from "react";
import { AppLayout } from "../layout/AppLayout";
import Header from "../layout/Header";
import { Messages } from "../layout/Messages";
import SendMessage from "../layout/SendMessage";
import { SideBar } from "../containers/SideBar";
import { GET_TEAMS } from "../graphql/teams";
import { useQuery } from "@apollo/react-hooks";

export const MainView = ({ match: { params } }) => {
  const { loading, error, data } = useQuery(GET_TEAMS);

  if (loading) return null;

  const team = data.allTeams.find((t) => t.id == params.teamId)
    ? data.allTeams.find((t) => t.id == params.teamId)
    : data.allTeams[0];
  const channel = team.channels.find((c) => c.id == params.channelId);

  return (
    <AppLayout>
      <SideBar
        teams={data.allTeams.map((t) => {
          return { id: t.id, letter: t.name.charAt(0).toUpperCase() };
        })}
        currentTeam={team}
      ></SideBar>
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul>
          <li>first item</li>
          <li>second item</li>
        </ul>
      </Messages>
      <SendMessage channelName={channel.name}></SendMessage>
    </AppLayout>
  );
};

import React from "react";
import { AppLayout } from "../layout/AppLayout";
import Header from "../layout/Header";
import SendMessage from "../layout/SendMessage";
import { SideBar } from "../containers/SideBar";
import { ME } from "../graphql/users";
import { useQuery } from "@apollo/react-hooks";
import { Container, Message } from "semantic-ui-react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { MessageContainer } from "../containers/MessageContainer";

export const MainView: React.FC<RouteComponentProps<any>> = ({
  match: { params },
}) => {
  const { loading, error, data } = useQuery(ME);

  if (loading) return null;
  if (error) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Unable to access data</Message.Header>
          {error.graphQLErrors[0] ? (
            <p>{error.graphQLErrors[0].message}</p>
          ) : (
            <p>{error.message}</p>
          )}
        </Message>
      </Container>
    );
  }
  if (!data.me.teams.length) {
    return <Redirect to="/create-team" />;
  }

  let idInt = parseInt(params.teamId, 10);
  let channelInt = parseInt(params.channelId, 10);

  const team = data.me.teams.find((t) => t.id === idInt)
    ? data.me.teams.find((t) => t.id === idInt)
    : data.me.teams[0];
  const channel = team.channels.find((c) => c.id === channelInt)
    ? team.channels.find((c) => c.id === channelInt)
    : team.channels[0];
  return (
    <AppLayout>
      <SideBar
        teams={data.me.teams.map((t) => {
          return { id: t.id, letter: t.name.charAt(0).toUpperCase() };
        })}
        currentTeam={team}
      ></SideBar>
      {channel && <Header channelName={channel.name} />}
      {channel && <MessageContainer channelId={channel.id} />}
      <SendMessage
        channelName={channel.name}
        channelId={channel.id}
      ></SendMessage>
    </AppLayout>
  );
};

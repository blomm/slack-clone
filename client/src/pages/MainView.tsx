import React from "react";
import { AppLayout } from "../layout/AppLayout";
import Header from "../layout/Header";
import SendMessage from "../layout/SendMessage";
import { SideBar } from "../containers/SideBar";
import { GET_TEAMS } from "../graphql/teams";
import { ME } from "../graphql/users";
import { useQuery } from "@apollo/react-hooks";
import { Container, Message } from "semantic-ui-react";
import { RouteComponentProps, Redirect, Route } from "react-router-dom";
import { ChannelMessageContainer } from "../containers/ChannelMessageContainer";
import { DirectMessageContainer } from "../containers/DirectMessageContainer";

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
  // let type =
  //   params.type === "chan" || params.type === "dm" ? params.type : "chan";

  const team = data.me.teams.find((t) => t.id === idInt)
    ? data.me.teams.find((t) => t.id === idInt)
    : data.me.teams[0];

  return (
    <AppLayout>
      <SideBar
        teams={data.me.teams.map((t) => {
          return { id: t.id, letter: t.name.charAt(0).toUpperCase() };
        })}
        currentTeam={team}
      ></SideBar>
      <Route
        path={`/view-team/:teamId?/chan/:channelId?`}
        exact
        render={(props) => (
          <ChannelMessageContainer
            {...props}
            channels={team.channels}
          ></ChannelMessageContainer>
        )}
      ></Route>
      <Route
        path={`/view-team/:teamId?/dm/:memberId?`}
        exact
        render={(props) => (
          <DirectMessageContainer
            {...props}
            members={team.members}
          ></DirectMessageContainer>
        )}
      ></Route>
    </AppLayout>
  );
};

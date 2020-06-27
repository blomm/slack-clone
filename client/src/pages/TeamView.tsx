import React from "react";
import {
  Channels,
  Header,
  Input,
  LayoutContainer,
  Messages,
  Teams,
} from "../layout/Containers";

export const TeamView = () => {
  return (
    <LayoutContainer>
      <Teams>Teams</Teams>
      <Channels>Channels</Channels>
      <Header>Header</Header>
      <Messages>
        <ul>
          <li>first item</li>
          <li>second item</li>
        </ul>
      </Messages>
      <Input>
        <input type="text" placeholder="CSS Grid Layout Module" />
      </Input>
    </LayoutContainer>
  );
};

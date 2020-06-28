import styled from "styled-components";
import React from "react";
import { link } from "fs";

const ChannelsWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #52364e;
  color: #ffffff;
`;

const paddingLeft = "padding-left: 10px;";
const noPaddingLeft = "padding-left: 0px;";
const headerFontSize = "font-size: 16px;";

const ChannelHeader = styled.h1`
  margin-top: 10px;
  ${paddingLeft}
  ${headerFontSize}
`;

const ChannelList = styled.ul`
  margin: 0;
  list-style: none;
  ${noPaddingLeft}
`;

const ChannelListItem = styled.li`
  ${paddingLeft}
  &:hover {
    background-color: #362233;
  }
`;

const green = {
  color: "#38978d",
};

const Bubble = ({ on = true }) => {
  return on ? <span style={green}>&#9679;</span> : <span>&#9675;</span>;
};

interface ChannelProps {
  teamName: string;
  userName: string;
  channels: any[];
  users: any;
}

export const Channels: React.FC<ChannelProps> = ({
  teamName,
  userName,
  channels,
  users,
}) => {
  return (
    <ChannelsWrapper>
      <ChannelHeader>{teamName}</ChannelHeader>
      <ChannelHeader>{userName}</ChannelHeader>
      <ChannelHeader>Channels</ChannelHeader>
      <ChannelList>
        {channels.map((c, i) => (
          <ChannelListItem key={i}># {c.name}</ChannelListItem>
        ))}
      </ChannelList>
      <ChannelHeader>Direct messages</ChannelHeader>
      <ChannelList>
        {users.map((u, i) => (
          <ChannelListItem key={i}>
            <Bubble on={false} /> {u.name}
          </ChannelListItem>
        ))}
      </ChannelList>
    </ChannelsWrapper>
  );
};

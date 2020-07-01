import styled from "styled-components";
import React from "react";

const MessagesWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  border: solid 1px red;
`;

interface MessagesProps {
  channelId: number;
}

export const Messages: React.FC<MessagesProps> = ({ channelId }) => {
  return <MessagesWrapper></MessagesWrapper>;
};

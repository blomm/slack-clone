import styled from "styled-components";
import React from "react";

const MessagesWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  padding: 20px;
`;

export const Messages: React.FC = ({ children }) => {
  return <MessagesWrapper>{children}</MessagesWrapper>;
};

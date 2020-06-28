import styled from "styled-components";
import { Input } from "semantic-ui-react";
import React from "react";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

export default ({ channelName }) => {
  return (
    <SendMessageWrapper>
      <Input fluid placeholder={`Message #${channelName}`} />
    </SendMessageWrapper>
  );
};

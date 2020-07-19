import styled from "styled-components";
import React from "react";
import { Header } from "semantic-ui-react";

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

interface HeaderProps {
  titletext: string;
}

export default (({ titletext }) => {
  return (
    <HeaderWrapper>
      <Header textAlign="center"># {titletext}</Header>
    </HeaderWrapper>
  );
}) as React.FC<HeaderProps>;

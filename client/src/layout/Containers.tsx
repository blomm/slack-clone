import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 100px 250px 1fr;
  grid-template-rows: auto 1fr auto;
  border: solid 1px red;
`;

export const Header = styled.div`
  grid-column: 3;
  grid-row: 1;
  border: solid 1px red;
`;

export const Teams = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362233;
`;

export const Channels = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #52364e;
`;

export const Messages = styled.div`
  grid-column: 3;
  grid-row: 2;
  border: solid 1px red;
`;

export const Input = styled.div`
  grid-column: 3;
  grid-row: 3;
  border: solid 1px red;
`;

import React, { useState } from "react";
import { Button, Input, Container, Header } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export const Register = () => {
  const [
    register,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(REGISTER, {
    onCompleted: (data: any) => {
      console.log(data);
    },
  });
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    password: "",
    email: "",
  });
  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setRegisterDetails({ ...registerDetails, [name]: value });
  };

  const handleClick = (e: any) => {
    register({
      variables: {
        username: registerDetails.username,
        email: registerDetails.email,
        password: registerDetails.password,
      },
    });
  };

  return (
    <Container text>
      <Header as="h2">Register</Header>
      <Input
        name="username"
        onChange={handleChange}
        value={registerDetails.username}
        fluid
        placeholder="Username"
      />
      <Input
        name="email"
        onChange={handleChange}
        value={registerDetails.email}
        fluid
        placeholder="Email"
      />
      <Input
        name="password"
        onChange={handleChange}
        value={registerDetails.password}
        type="password"
        fluid
        placeholder="Password"
      />
      <Button content="Submit" onClick={handleClick} />
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
    </Container>
  );
};

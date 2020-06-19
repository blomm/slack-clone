import React, { useState } from "react";
import { Button, Input, Container, Header } from "semantic-ui-react";

export const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleClick = (e) => {
    // we could send an action to a reducer
    // but useMutation hook is easier
  };

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Input
        name="username"
        onChange={handleChange}
        value={loginDetails.username}
        fluid
        placeholder="Username"
      />
      <Input
        name="password"
        onChange={handleChange}
        value={loginDetails.password}
        type="password"
        fluid
        placeholder="Password"
      />
      <Button content="Submit" onClick={handleClick} />
    </Container>
  );
};

import React, { useState } from "react";
import { Message, Button, Input, Container, Header } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useHistory } from "react-router";

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const Register = () => {
  //useHistory Hook
  const history = useHistory();

  const [register, { loading: mutationLoading }] = useMutation(REGISTER, {
    onCompleted: (data: any) => {
      const { ok, errors } = data.register;
      if (errors) {
        console.log(errors);
        setRegisterDetails({ ...registerDetails, errors });
      } else if (ok) {
        history.push("/users");
      }
    },
  });
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    errors: [],
    password: "",
    email: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRegisterDetails({ ...registerDetails, [name]: value });
  };

  const handleClick = (e: any) => {
    // clear errors when user submits
    setRegisterDetails({ ...registerDetails, errors: [] });
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
        error={!!registerDetails.errors.find((x) => x.path === "username")}
        name="username"
        onChange={handleChange}
        value={registerDetails.username}
        fluid
        placeholder="Username"
      />
      <Input
        error={!!registerDetails.errors.find((x) => x.path === "email")}
        name="email"
        onChange={handleChange}
        value={registerDetails.email}
        fluid
        placeholder="Email"
      />
      <Input
        error={!!registerDetails.errors.find((x) => x.path === "password")}
        name="password"
        onChange={handleChange}
        value={registerDetails.password}
        type="password"
        fluid
        placeholder="Password"
      />
      <Button content="Submit" onClick={handleClick} />
      {mutationLoading && <p>Loading...</p>}
      {registerDetails.errors.length > 0 && (
        <Message
          error
          header="There was some errors with your submission"
          list={registerDetails.errors.map((err) => err.message)}
        />
      )}
    </Container>
  );
};

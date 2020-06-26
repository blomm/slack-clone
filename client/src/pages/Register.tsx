import React, { useState } from "react";
import {
  Form,
  Message,
  Button,
  Input,
  Container,
  Header,
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useHistory } from "react-router";
import { setAccessToken } from "../token";

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      authToken
      refreshToken
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
        setRegisterDetails({ ...registerDetails, errors });
      } else if (ok) {
        setAccessToken(data.register.authToken);
        localStorage.setItem("REFRESH_TOKEN", data.login.refreshToken);
        history.push("/users");
      }
    },
    onError: (err) => {
      // console.log(`err ${err}`);
      // loginError.graphQLErrors.map((err) => err.message)
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
      <Form>
        <Form.Field
          error={!!registerDetails.errors.find((x) => x.path === "username")}
        >
          <Input
            name="username"
            onChange={handleChange}
            value={registerDetails.username}
            fluid
            placeholder="Username"
          />
        </Form.Field>
        <Form.Field
          error={!!registerDetails.errors.find((x) => x.path === "email")}
        >
          <Input
            name="email"
            onChange={handleChange}
            value={registerDetails.email}
            fluid
            placeholder="Email"
          />
        </Form.Field>
        <Form.Field
          error={!!registerDetails.errors.find((x) => x.path === "password")}
        >
          <Input
            name="password"
            onChange={handleChange}
            value={registerDetails.password}
            type="password"
            fluid
            placeholder="Password"
          />
        </Form.Field>

        <Button content="Submit" onClick={handleClick} />
      </Form>
      {mutationLoading && <p>Loading...</p>}
      {registerDetails.errors.length ? (
        <Message
          error
          header="There was some errors with your submission"
          list={registerDetails.errors.map((err) => err.message)}
        />
      ) : null}
    </Container>
  );
};

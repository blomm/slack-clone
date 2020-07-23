import React, { useState } from "react";
import {
  Message,
  Button,
  Input,
  Container,
  Header,
  Form,
} from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { setAccessToken } from "../token";
import { useHistory } from "react-router-dom";
import { LOGIN } from "../graphql/users";

export const Login = () => {
  const history = useHistory();

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [login, { loading, error }] = useMutation(LOGIN, {
    // While you can use the exposed error state to update
    // your UI, doing so is not a substitute for actually handling
    // the error. You must either provide an onError callback
    // or catch the error
    onError: (err: any) => {},
    onCompleted: (data: any) => {
      // TODO: store the refreshToken somewhere
      setAccessToken(data.login.authToken);
      localStorage.setItem("REFRESH_TOKEN", data.login.refreshToken);
      history.push("/view-team");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    // we could send an action to a reducer
    // but useMutation hook is easier
    // wrapping a try catch here is an alternative to
    // the mutations onError callback
    login({
      variables: {
        email: loginDetails.email,
        password: loginDetails.password,
      },
    });
  };

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field>
          <Input
            name="email"
            onChange={handleChange}
            value={loginDetails.email}
            fluid
            placeholder="email"
          />
        </Form.Field>
        <Form.Field>
          <Input
            name="password"
            onChange={handleChange}
            value={loginDetails.password}
            type="password"
            fluid
            placeholder="Password"
          />
        </Form.Field>
        <Button
          content="Submit"
          data-testid="login-submit"
          onClick={handleSubmit}
        />
        {loading ? <p>Loading...</p> : null}
        {error && error.graphQLErrors ? (
          <Message error list={error.graphQLErrors.map((err) => err.message)} />
        ) : null}
      </Form>
    </Container>
  );
};

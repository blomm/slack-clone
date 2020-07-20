import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Users } from "./pages/Users";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Team } from "./pages/Team";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "./token";
import { MainView } from "./pages/MainView";
import "./App.css";

const isAuthenticated = () => {
  try {
    const access = getAccessToken();
    const refresh = localStorage.getItem("REFRESH_TOKEN");
    if (access) {
      jwtDecode(access);
    } else if (refresh) {
      jwtDecode(refresh);
    }
    return true;
  } catch (err) {
    return false;
  }
};
const PrivateRouteComponent = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    }
  />
);

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link to="/create-team">Create Team </Link>
            </li>
            <li className="nav-item">
              <Link to="/view-team">View Team </Link>
            </li>
            <li className="nav-item">
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/users" component={Users}></Route>
          <Route exact path="/login" component={Login}></Route>

          <PrivateRouteComponent
            path="/view-team/:teamId?"
            component={MainView}
          />
          <PrivateRoute path="/create-team">
            <Team></Team>
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

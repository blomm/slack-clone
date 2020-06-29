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
import { Others } from "./pages/Others";
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
              <Link to="/team">Create Team </Link>
            </li>
            <li className="nav-item">
              <Link to="/view-team">View Team </Link>
            </li>
            <li className="nav-item">
              <Link to="/users">Users</Link>
            </li>
            <li className="nav-item">
              <Link to="/others">Others</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/users" component={Users}></Route>
          <Route exact path="/others" component={Others}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route
            path="/view-team/:teamId?/:channelId?"
            component={MainView}
          ></Route>
          <PrivateRoute path="/team">
            <Team></Team>
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

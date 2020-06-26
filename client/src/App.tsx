import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Team } from "./pages/Team";
import { Others } from "./pages/Others";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/team">Create Team </Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
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
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/team" component={Team}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

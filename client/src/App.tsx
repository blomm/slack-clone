import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { About } from "./pages/About";

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
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/about" component={About}></Route>
          <Route exact path="/users" component={Users}></Route>
          <Route exact path="/" component={Home}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

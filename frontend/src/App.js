import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";
import user from "../../models/user";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiraion) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {};

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: null,
              userId: null,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={EventsPage} />
                <Route path="/bookings" component={BookingsPage} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;

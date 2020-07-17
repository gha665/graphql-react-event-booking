import React from "react";
import { NavLink } from "react-router-dom";

const mainNavigation = (props) => (
  <header>
    <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navigation__item">
      <ul>
        <li>
          <Navlink to="/auth">Authenticate</Navlink>
        </li>
        <li>
          <Navlink to="/events">Events</Navlink>
        </li>
        <li>
          <Navlink to="/bookings">Bookings</Navlink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;

import React from "react";

import "./EventList.css";

const eventList = (props) => {
  const events = props.events.map();
  
  return <ul className="event__list">{events}</ul>;
};

export default eventList;

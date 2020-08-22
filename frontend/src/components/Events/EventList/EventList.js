import React from "react";

import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = (props) => {
  const events = props.events.map((event) => {
    return (
        <EventItem />
      <li key={event._id} className="events__list-item">
        {event.title}
      </li>
    );
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;

import React from "react";

const eventItem = (props) => (
  <li key={props.eventId} className="events__list-item">
    {props.title}
  </li>
);

export default eventItem;

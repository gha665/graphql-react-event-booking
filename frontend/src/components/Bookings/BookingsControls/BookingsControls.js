import React from "react";
import bookingsChart from "../BookingsChart/BookingsChart";

const bookingsControl = (props) => {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={this.changeOutputTypeHandler.bind(this, "list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={this.changeOutputTypeHandler.bind(this, "chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default bookingsControl;

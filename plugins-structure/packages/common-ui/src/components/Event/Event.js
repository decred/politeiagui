import React from "react";
import PropTypes from "prop-types";
import { DateTooltip } from "../DateTooltip";

function getEventText(event, timeago) {
  if (!event && timeago) return timeago;
  return [event, timeago].join(" ");
}

const Event = ({ event, timestamp, className, ...props }) => (
  <DateTooltip timestamp={timestamp} placement="bottom" {...props}>
    {({ timeAgo }) => (
      <span className={className}>{getEventText(event, timeAgo)}</span>
    )}
  </DateTooltip>
);

Event.propTypes = {
  event: PropTypes.node,
  timestamp: PropTypes.number.isRequired,
  show: PropTypes.bool,
};

Event.defaultProps = {
  event: "",
};

export default Event;

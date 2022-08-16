import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { DateTooltip } from "../DateTooltip";
import { Text, classNames } from "pi-ui";

const Event = ({ event, timestamp, className, size, ...props }) => (
  <DateTooltip timestamp={timestamp} placement="bottom" {...props}>
    {({ timeAgo }) => (
      <Text
        id={`event-${event}-${timestamp}`}
        className={classNames(styles.eventTooltip, className)}
        truncate
        size={size}
      >
        {event} {timeAgo}
      </Text>
    )}
  </DateTooltip>
);

Event.propTypes = {
  event: PropTypes.node,
  timestamp: PropTypes.number,
  show: PropTypes.bool,
};

Event.defaultProps = {
  event: "",
};

export default Event;

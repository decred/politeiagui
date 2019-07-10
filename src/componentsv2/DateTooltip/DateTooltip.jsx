import React, { useMemo } from "react";
import PropTypes from "prop-types";
import distance from "date-fns/distance_in_words";
import { Tooltip, classNames } from "pi-ui";
import styles from "./DateTooltip.module.css";

const getTimeAgo = timestamp =>
  distance(new Date(), new Date(timestamp * 1000), { addSuffix: true });

const DateTooltip = ({ timestamp, placement, className, children }) => {
  const date = new Date(timestamp * 1000);
  const timeAgo = useMemo(() => getTimeAgo(timestamp), [timestamp]);
  return (
    <Tooltip
      className={classNames(className, styles.dateTooltip)}
      content={date.toISOString()}
      placement={placement}
    >
      {children({ timeAgo })}
    </Tooltip>
  );
};

DateTooltip.propTypes = {
  timestamp: PropTypes.number.isRequired,
  placement: PropTypes.string,
  className: PropTypes.string
};

export default DateTooltip;

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import distance from "date-fns/distance_in_words";
import { Tooltip, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { formatUnixTimestamp } from "../../utils";

const getTimeAgo = (timestamp) =>
  distance(new Date(), new Date(timestamp * 1000), { addSuffix: true });

const DateTooltip = ({
  timestamp,
  placement,
  className,
  children,
  ...props
}) => {
  const timeAgo = useMemo(() => getTimeAgo(timestamp), [timestamp]);

  return (
    <Tooltip
      className={classNames(className, styles.dateTooltip)}
      content={formatUnixTimestamp(timestamp)}
      placement={placement}
      {...props}
    >
      {children({ timeAgo })}
    </Tooltip>
  );
};

DateTooltip.propTypes = {
  timestamp: PropTypes.number.isRequired,
  placement: PropTypes.string,
  className: PropTypes.string,
};

export default DateTooltip;

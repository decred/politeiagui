import React, { useMemo } from "react";
import PropTypes from "prop-types";
import formatDistance from "date-fns/formatDistance";
import { Tooltip } from "pi-ui";
import styles from "./styles.module.css";
import { formatUnixTimestamp } from "../../utils";

const getTimeAgo = (timestamp) =>
  formatDistance(new Date(timestamp * 1000), new Date(), { addSuffix: true });

const DateTooltip = ({
  timestamp,
  placement,
  className,
  children,
  ...props
}) => {
  const timeAgo = useMemo(() => getTimeAgo(timestamp), [timestamp]);

  return (
    <span>
      <Tooltip
        contentClassName={styles.content}
        className={className}
        content={formatUnixTimestamp(timestamp)}
        placement={placement}
        {...props}
      >
        {children({ timeAgo })}
      </Tooltip>
    </span>
  );
};

DateTooltip.propTypes = {
  timestamp: PropTypes.number.isRequired,
  placement: PropTypes.string,
  className: PropTypes.string,
};

export default DateTooltip;

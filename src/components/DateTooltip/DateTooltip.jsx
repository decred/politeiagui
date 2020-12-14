import React, { useMemo } from "react";
import PropTypes from "prop-types";
import distance from "date-fns/distance_in_words";
import { Tooltip, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import styles from "./DateTooltip.module.css";
import { formatUnixTimestamp } from "src/utils";

const getTimeAgo = (timestamp) => {
  const dateTimestamp = new Date(timestamp * 1000);
  const now = new Date();
  const opts = { addSuffix: true };
  // this forces time to be in the past.
  // Reported by: https://github.com/decred/politeiagui/issues/2246
  return now > dateTimestamp
    ? distance(now, dateTimestamp, opts)
    : distance(now, now, opts);
};

const DateTooltip = ({ timestamp, placement, className, children }) => {
  const timeAgo = useMemo(() => getTimeAgo(timestamp), [timestamp]);

  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  return (
    <Tooltip
      className={classNames(
        className,
        styles.dateTooltip,
        isDarkTheme && styles.darkDateTooltip
      )}
      content={formatUnixTimestamp(timestamp)}
      placement={placement}>
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

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import distance from "date-fns/distance_in_words";
import { Tooltip, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import styles from "./DateTooltip.module.css";
import { formatUnixTimestamp } from "src/utils";

const getTimeAgo = (timestamp) =>
  distance(new Date(), new Date(timestamp * 1000), { addSuffix: true });

const DateTooltip = ({
  timestamp,
  placement,
  className,
  additionInfo,
  children
}) => {
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
      content={
        <>
          {formatUnixTimestamp(timestamp)}
          {additionInfo && <p>{additionInfo}</p>}
        </>
      }
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

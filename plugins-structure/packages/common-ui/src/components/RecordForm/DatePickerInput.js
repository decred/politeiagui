import React from "react";
import { Controller } from "react-hook-form";
import {
  DatePickerV2 as DatePicker,
  Icon,
  Text,
  Tooltip,
  classNames,
} from "pi-ui";
import styles from "./styles.module.css";
import {
  formatDateObjToTimestamp,
  formatShortUnixTimestamp,
  formatUnixTimestampToObj,
} from "../../utils";
import { MONTHS_LABELS } from "../../constants";

const PickerError = ({ error }) => (
  <p className={classNames(styles.datePickerError, error && styles.visible)}>
    {error}
  </p>
);

const PickerContent = ({ date, placeholder, tooltipInfo }) => (
  <div className={styles.datePickerContent}>
    {date ? (
      formatShortUnixTimestamp(date)
    ) : (
      <Text className={styles.datePickerPlaceholder}>{placeholder}</Text>
    )}
    <div>
      <Icon type="calendar" />
      {tooltipInfo && (
        <Tooltip content={tooltipInfo} className={styles.info}>
          <Icon type="info" />
        </Tooltip>
      )}
    </div>
  </div>
);

export function DatePickerInput({
  name = "datePicker",
  placeholder,
  className,
  tabIndex,
  isMonthsMode,
  tooltipInfo,
  maxTimestamp,
  minTimestamp,
  ...props
}) {
  const handleChange = (fn) => (values) => {
    const timestamp = formatDateObjToTimestamp(values);
    fn(timestamp);
  };

  return (
    <Controller
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={styles.datePickerWrapper} {...props}>
          <DatePicker
            className={classNames(styles.datePicker, className)}
            activeClassName={styles.activeDatePicker}
            value={value && formatUnixTimestampToObj(value)}
            isMonthsMode={isMonthsMode}
            maxTimestamp={maxTimestamp}
            minTimestamp={minTimestamp}
            lang={MONTHS_LABELS}
            tabIndex={tabIndex}
            onChange={handleChange(onChange)}
          >
            <PickerContent
              date={value}
              placeholder={placeholder}
              tooltipInfo={tooltipInfo}
            />
          </DatePicker>
          <PickerError error={error} />
        </div>
      )}
    />
  );
}

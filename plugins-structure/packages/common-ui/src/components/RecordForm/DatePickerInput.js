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
import { formatDateToInternationalString } from "../../utils";
import { MONTHS_LABELS } from "../../constants";

export function DatePickerInput({
  name = "datePicker",
  placeholder,
  className,
  tabIndex,
  isMonthsMode,
  tooltipInfo,
  maxTimestamp,
  minTimestamp,
}) {
  function formatValue(value) {
    return formatDateToInternationalString(value);
  }

  return (
    <Controller
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={styles.datePickerWrapper}>
          <DatePicker
            className={classNames(styles.datePicker, className)}
            activeClassName={styles.activeDatePicker}
            value={value}
            isMonthsMode={isMonthsMode}
            maxTimestamp={maxTimestamp}
            minTimestamp={minTimestamp}
            lang={MONTHS_LABELS}
            tabIndex={tabIndex}
            onChange={onChange}
          >
            <div className={styles.datePickerContent}>
              {value ? (
                formatValue(value)
              ) : (
                <Text className={styles.datePickerPlaceholder}>
                  {placeholder}
                </Text>
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
          </DatePicker>
          <p
            className={classNames(
              styles.datePickerError,
              error && styles.visible
            )}
          >
            {error}
          </p>
        </div>
      )}
    />
  );
}

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { DatePicker, Icon, Text, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { formatDateToInternationalString } from "../../utils";
import { MONTHS_LABELS } from "../../constants";

export function DatePickerInput({
  name = "datePicker",
  placeholder,
  years,
  className,
  isRange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function formatValue(value) {
    // If range mode is on, format both values and return as string.
    if (isRange) {
      let firstFormattedValue = "";
      if (value[0]) {
        firstFormattedValue = `${formatDateToInternationalString(value[0])} - `;
      }
      let secondFormattedValue;
      if (value[1]) {
        secondFormattedValue = `${formatDateToInternationalString(value[1])}`;
      }
      return `${firstFormattedValue}${secondFormattedValue}`;
    }
    // In single mode return the formatted picked date.
    return formatDateToInternationalString(value);
  }
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={styles.datePickerWrapper}>
          <DatePicker
            className={classNames(styles.datePicker, className)}
            show={isOpen}
            value={value}
            years={years}
            isRange={isRange}
            lang={MONTHS_LABELS}
            onDismiss={() => setIsOpen(false)}
            onChange={(year, month, day) => onChange({ year, month, day })}
          >
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={styles.datePickerContent}
            >
              {value ? (
                formatValue(value)
              ) : (
                <Text className={styles.datePickerPlaceholder}>
                  {placeholder}
                </Text>
              )}
              <Icon type="calendar" />
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

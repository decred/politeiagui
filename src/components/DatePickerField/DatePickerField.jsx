import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { classNames, DatePicker, Icon, Text } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./DatePickerField.module.css";
import { Row } from "../layout";
import { MONTHS_LABELS } from "src/constants";
import { formatDateToInternationalString } from "src/helpers";

const DatePickerField = ({
  name,
  placeholder,
  years,
  className,
  isRange,
  error,
  dataTestid
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePicker = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return (
    <FormikConsumer>
      {({ setFieldValue, setFieldTouched, values }) => {
        const onDateChange = (year, month, day) => {
          if (!!year && !!month && !!day) {
            setFieldValue(name, { year, month, day });
          }
          setFieldTouched(name, true);
          setIsOpen(false);
        };

        const value = values[name];
        const onRangeChange = (year, month, day, idx) => {
          if (!!year && !!month && !!day) {
            const newValue = value ? [...value] : [];
            newValue[idx] = { year, month, day };
            setFieldValue(name, newValue);
          }
        };

        const onDismiss = () => {
          if (isOpen) {
            setFieldTouched(name, true);
            setIsOpen(false);
          }
        };

        const formattedValue = () => {
          // If range mode is on, format both values and return as string.
          if (isRange) {
            let firstFormattedValue = "";
            if (value[0]) {
              firstFormattedValue = `${formatDateToInternationalString(
                value[0]
              )} - `;
            }
            let secondFormattedValue;
            if (value[1]) {
              secondFormattedValue = `${formatDateToInternationalString(
                value[1]
              )}`;
            }
            return `${firstFormattedValue}${secondFormattedValue}`;
          }
          // In single mode return the formatted picked date.
          return formatDateToInternationalString(value);
        };

        return (
          <div className={classNames("cursor-pointer", className)} data-testid={dataTestid}>
            <DatePicker
              show={isOpen}
              years={years}
              isRange={isRange}
              value={values[name]}
              lang={MONTHS_LABELS}
              onChange={isRange ? onRangeChange : onDateChange}
              onDismiss={onDismiss}>
              <Row
                className={styles.box}
                justify="space-between"
                align="center"
                noMargin
                onClick={togglePicker}>
                {value && formattedValue()}
                {!value && (
                  <Text className={styles.placeholder}>{placeholder}</Text>
                )}
                <Icon type="calendar" />
              </Row>
            </DatePicker>
            <p className={classNames(styles.errorMsg, styles.active)}>
              {error}
            </p>
          </div>
        );
      }}
    </FormikConsumer>
  );
};

DatePickerField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  year: PropTypes.object,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  dataTestid: PropTypes.string
};

DatePickerField.defaultProps = {
  readOnly: false
};

export default DatePickerField;

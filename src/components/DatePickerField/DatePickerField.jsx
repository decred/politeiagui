import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { classNames, DatePickerV2, Icon, Text } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./DatePickerField.module.css";
import { Row } from "../layout";
import { MONTHS_LABELS } from "src/constants";
import { formatDateToInternationalString } from "src/helpers";

const DatePickerField = ({
  name,
  placeholder,
  className,
  isRange,
  maxTimestamp,
  minTimestamp,
  error,
  tabIndex
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePicker = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return (
    <FormikConsumer>
      {({ setFieldValue, setFieldTouched, values }) => {
        const onDateChange = ({ year, month, day }) => {
          if (!!year && !!month && !!day) {
            setFieldValue(name, { year, month, day });
          }
          setFieldTouched(name, true);
          setIsOpen(false);
        };

        const value = values[name];

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
          <div
            className={classNames("cursor-pointer", className)}
            data-testid="datepicker"
          >
            <DatePickerV2
              tabIndex={tabIndex}
              show={isOpen}
              minTimestamp={minTimestamp}
              maxTimestamp={maxTimestamp}
              value={value}
              lang={MONTHS_LABELS}
              onChange={onDateChange}
              onDismiss={onDismiss}
            >
              <Row
                className={styles.box}
                justify="space-between"
                align="center"
                noMargin
                onClick={togglePicker}
              >
                {value && formattedValue()}
                {!value && (
                  <Text className={styles.placeholder}>{placeholder}</Text>
                )}
                <Icon type="calendar" />
              </Row>
            </DatePickerV2>
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
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

DatePickerField.defaultProps = {
  readOnly: false
};

export default DatePickerField;

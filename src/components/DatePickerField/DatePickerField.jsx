import React from "react";
import PropTypes from "prop-types";
import { classNames, DatePicker, Icon, Text } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./DatePickerField.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { Row } from "../layout";
import { MONTHS_LABELS } from "src/constants";

const DatePickerField = ({
  name,
  placeholder,
  years,
  className,
  isRange,
  error
}) => {
  const [isOpen, openPicker, closePicker] = useBooleanState(false);
  const togglePicker = () => {
    if (!isOpen) {
      openPicker();
    } else {
      closePicker();
    }
  };
  return (
    <FormikConsumer>
      {({ setFieldValue, setFieldTouched, values }) => {
        const onDateChange = (year, month, day) => {
          if (!!year && !!month && !!day) {
            setFieldValue(name, { year, month, day });
          }
          setFieldTouched(name, true);
          closePicker();
        };

        const value = values[name];
        const onRangeChange = (year, month, day, idx) => {
          if (!!year && !!month && !!day) {
            const newValue = value ? [...value] : [];
            newValue[idx] = { year, month, day };
            setFieldValue(name, newValue);
          }

          setFieldTouched(name, true);
        };

        return (
          <div className={classNames("cursor-pointer", className)}>
            <DatePicker
              show={isOpen}
              years={years}
              isRange={isRange}
              value={values[name]}
              lang={MONTHS_LABELS}
              onChange={isRange ? onRangeChange : onDateChange}>
              <Row
                className={styles.box}
                justify="space-between"
                align="center"
                noMargin
                onClick={togglePicker}>
                {value &&
                  (isRange
                    ? (value[0]
                        ? `${value[0].month}/${value[0].day}/${value[0].year} - `
                        : "") +
                      (value[1]
                        ? `${value[1].month}/${value[1].day}/${value[1].year}`
                        : "")
                    : `${value.month}/${value.day}/${value.year}`)}
                {!value && (
                  <Text className={styles.placeholder}>{placeholder}</Text>
                )}
                <Icon type="calendar" />
              </Row>
            </DatePicker>
            {error && <p className={styles.errorMsg}>{error}</p>}
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
  className: PropTypes.string
};

DatePickerField.defaultProps = {
  readOnly: false
};

export default DatePickerField;

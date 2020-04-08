import React from "react";
import PropTypes from "prop-types";
import { classNames, DatePicker, Icon } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./DatePickerField.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { Row } from "../layout";

const DatePickerField = ({ name, label, years, className }) => {
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
      {({ setFieldValue, values, errors }) => {
        const onChange = (year, month, day) => {
          if (!!year && !!month && !!day) {
            setFieldValue(name, { year, month, day });
          }
          closePicker();
        };
        const value = values[name];
        return (
          <div className={classNames("cursor-pointer", className)}>
            <DatePicker
              show={isOpen}
              years={years}
              value={values[name]}
              lang={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              onChange={onChange}>
              <Row
                className={styles.box}
                justify="space-between"
                align="center"
                noMargin
                onClick={togglePicker}>
                {value ? `${value.month}/${value.day}/${value.year}` : label}
                <Icon type="calendar" />
              </Row>
            </DatePicker>
            {errors && errors[name]}
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

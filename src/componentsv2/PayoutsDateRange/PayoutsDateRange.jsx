import React, { useEffect } from "react";
import { Formik } from "formik";

import MonthPickerField from "src/componentsv2/MonthPicker/MonthPickerField";
import {
  getMinMaxYearAndMonth,
  getInitialDateValue
} from "src/containers/Invoice";
import styles from "./PayoutsDateRange.module.css";

const DEFAULT_INITIAL_VALUES = {
  sDate: getInitialDateValue(),
  eDate: getInitialDateValue()
};

const PayoutsDateRange = ({ onChange, children }) => {
  return (
    <Formik initialValues={DEFAULT_INITIAL_VALUES}>
      {formikProps => {
        const { values } = formikProps;
        return (
          <>
            <form className={styles.form}>
            <MonthPickerField
                years={getMinMaxYearAndMonth()}
                name="sDate"
                label="Start"
              />

              <MonthPickerField
                className={"margin-left-s"}
                years={getMinMaxYearAndMonth()}
                name="eDate"
                label="End"
              />
              <HookOnFormChange formikProps={formikProps} onChange={onChange} />
            </form>
            {children && children(values)}
          </>
        );
      }}
    </Formik>
  );
};

const HookOnFormChange = ({ formikProps, onChange }) => {
  useEffect(() => {
    onChange(formikProps.values);
  }, [formikProps.values, onChange]);
  return null;
};

export default PayoutsDateRange;

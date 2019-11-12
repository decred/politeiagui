import React, { useCallback, useEffect } from "react";
import { Text, Spinner } from "pi-ui";
import { FormikConsumer } from "formik";
import useExchangeRate from "src/hooks/api/useExchangeRate";

export const ExchangeRateField = ({ month, year, onChange, name }) => {
  const [rate, loading] = useExchangeRate(month, year);
  const handleChange = useCallback(
    rate => {
      onChange(name, rate);
    },
    [onChange, name]
  );
  useEffect(() => {
    handleChange(rate);
  }, [rate, handleChange]);
  return (
    <div style={{ display: "grid" }}>
      <Text color="gray">Exchange rate</Text>
      {loading ? <Spinner invert /> : <Text>${rate / 100}</Text>}
    </div>
  );
};

const Wrapper = ({ name }) => {
  return (
    <FormikConsumer>
      {({ setFieldValue, values }) => {
        const {
          date: { month, year }
        } = values;
        return (
          <ExchangeRateField
            month={month}
            year={year}
            name={name}
            onChange={setFieldValue}
          />
        );
      }}
    </FormikConsumer>
  );
};

export default Wrapper;

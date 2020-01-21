import React, { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { BoxTextInput, Button, Message, RadioButtonGroup, classNames } from "pi-ui";
import { Formik } from "formik";
import { withRouter } from "react-router-dom";
import usePolicy from "src/hooks/api/usePolicy";
import { dccValidationSchema } from "./validation";
import { SelectField } from "src/componentsv2/Select";
// import DraftSaver from "./DraftSaver";
import useSessionStorage from "src/hooks/utils/useSessionStorage";
import styles from "./DccForm.module.css";
import {
  getDomainOptions,
  getContractorTypeOptions,
  getDccTypeOptions,
  getNomineeOptions,
  DCC_TYPE_ISSUANCE
} from "src/containers/DCC";

const Select = ({ error, ...props }) => (
  <div className={classNames(styles.formSelect, error && styles.formSelectError)}>
    <SelectField {...props}/>
    { error &&
      <p className={styles.errorMsg}>{error}</p>
    }
  </div>
);

const DccForm = React.memo(function DccForm({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
  isValid,
  cmsUsers,
  setSessionStorageDcc
}) {
  // scroll to top in case of global error
  useEffect(() => {
    if (errors.global) {
      window.scrollTo(0, 0);
    }
  }, [errors]);

  const SubmitButton = () => (
    <Button
      type="submit"
      kind={!isValid ? "disabled" : "primary"}
      loading={isSubmitting}>
      Submit
    </Button>
  );

  const handleChangeWithTouched = (field) => (e) => {
    setFieldTouched(field, true);
    setSessionStorageDcc({
      ...values,
      [field]: e.target.value
    });
    handleChange(e);
  };

  const handleChangeDccType = (e) => {
    setFieldTouched("type", true);
    setSessionStorageDcc({
      ...values,
      "type": e.value
    });
    setFieldValue("type", e.value);
    setFieldValue("nomineeid", "");
  };

  const handleChangeSelector = (field) => (e) => {
    setFieldTouched(field, true);
    setFieldValue(field, e.value);
    return e;
  };

  const isIssuance = useMemo(() => values.type === DCC_TYPE_ISSUANCE, [values.type]);
  const nomineeOptions = useMemo(() =>
    isIssuance
      ? getNomineeOptions(cmsUsers.nominee)
      : getNomineeOptions(cmsUsers.full)
  , [isIssuance, cmsUsers]);
  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.global && (
        <Message kind="error">{errors.global.toString()}</Message>
      )}

      <RadioButtonGroup
        label="DCC Type"
        name="type"
        options={getDccTypeOptions()}
        value={values.type}
        error={touched.type && errors.type}
        onChange={handleChangeDccType}
      />

      <Select
        name="nomineeid"
        options={nomineeOptions}
        placeholder="Nominee"
        error={touched.nomineeid && errors.nomineeid}
        onChange={handleChangeSelector("nomineeid")}
      />

      { isIssuance && (
        <>
          <Select
            name="domain"
            options={getDomainOptions()}
            placeholder="Domain"
            error={touched.domain && errors.domain}
            onChange={handleChangeSelector("domain")}
          />
          <Select
            name="contractortype"
            options={getContractorTypeOptions()}
            placeholder="Contractor Type"
            error={touched.contractortype && errors.contractortype}
            onChange={handleChangeSelector("contractortype")}
          />
        </>
      )}
      <BoxTextInput
        placeholder="Statement"
        name="statement"
        tabIndex={1}
        value={values.statement}
        error={touched.statement && errors.statement}
        onChange={handleChangeWithTouched("statement")}
      />
      <div className="justify-right">
        {/* <DraftSaver submitSuccess={submitSuccess} /> */}
        <SubmitButton />
      </div>
    </form>
  );
});

const DccFormWrapper = ({ initialValues, onSubmit, history, cmsUsers }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { policy } = usePolicy();
  const dccFormValidation = useMemo(() => dccValidationSchema(policy), [
    policy
  ]);

  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        const token = await onSubmit(values);
        // Token from new dcc or from edit dcc
        const dccToken = token || values.token;
        setSubmitting(false);
        setSubmitSuccess(true);
        resetForm();
        history.push(`/dccs/${dccToken}`);
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit]
  );

  const FORM_INITIAL_VALUES = {
    type: "",
    nomineeid: "",
    statement: "",
    domain: "",
    contractortype: ""
  };
  let formInitialValues = initialValues || FORM_INITIAL_VALUES;
  const [sessionStorageDcc, setSessionStorageDcc] = useSessionStorage(
    "dcc",
    null
  );
  if (sessionStorageDcc !== null) {
    formInitialValues = sessionStorageDcc;
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={formInitialValues}
      validationSchema={dccFormValidation}
      >
      {(props) => (
        <DccForm {...{ ...props, submitSuccess, setSessionStorageDcc, cmsUsers }} />
      )}
    </Formik>
  );
};

DccFormWrapper.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  setSessionStorageDcc: PropTypes.func,
  setDccType: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(DccFormWrapper);

import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { dccValidationSchema } from "./validation";
import DraftSaver from "./DraftSaver";
import {
  getDomainOptions,
  getContractorTypeOptions,
  getDccTypeOptions,
  getNomineeOptions,
  DCC_TYPE_ISSUANCE,
  CONTRACTOR_TYPE_REVOKED
} from "src/containers/DCC";
import usePolicy from "src/hooks/api/usePolicy";
import { FormWrapperWithCache } from "src/components/FormWrapper";

const DccFormWrapper = ({
  onSubmit,
  history,
  cmsUsers,
  userDomain,
  isUserValid
}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { policy } = usePolicy();
  const dccFormValidation = useMemo(() => dccValidationSchema(policy), [
    policy
  ]);

  const FORM_INITIAL_VALUES = {
    type: 0,
    nomineeid: "",
    statement: "",
    domain: userDomain,
    contractortype: 0
  };

  const handleSubmit = useCallback(
    async (values) => {
      const token = await onSubmit(values);
      setSubmitSuccess(true);
      // Token from new dcc or from edit dcc
      const dccToken = token || values.token;
      history.push(`/dccs/${dccToken}`);
    },
    [history, onSubmit]
  );

  const formProps = {
    validationSchema: dccFormValidation,
    onSubmit: handleSubmit,
    initialValues: FORM_INITIAL_VALUES,
    enableReinitialize: true
  };

  return (
    <FormWrapperWithCache {...formProps} formName="dcc">
      {({
        Select,
        Actions,
        TextArea,
        Form,
        SubmitButton,
        RadioButtonGroup,
        setFieldValue,
        ErrorMessage,
        values
      }) => {
        const isIssuance = values.type === DCC_TYPE_ISSUANCE;
        const onChangeType = () => {
          setFieldValue("nomineeid", "");
          if (isIssuance) {
            setFieldValue("contractortype", CONTRACTOR_TYPE_REVOKED);
          }
        };
        const onChangeNominee = (e) => {
          setFieldValue("nomineeusername", e.label);
        };

        return (
          <Form>
            {!isUserValid && (
              <ErrorMessage kind="error">
                You don't have the contractor status required to complete a DCC
                request
              </ErrorMessage>
            )}
            <RadioButtonGroup
              name="type"
              options={getDccTypeOptions()}
              onChange={onChangeType}
              label="DCC Type"
            />
            <Select
              name="domain"
              placeholder="Domain"
              options={getDomainOptions()}
            />
            {isIssuance && (
              <>
                <Select
                  name="contractortype"
                  placeholder="Contractor Type"
                  options={getContractorTypeOptions()}
                />
                <Select
                  name="nomineeid"
                  options={getNomineeOptions(cmsUsers.nominee)}
                  placeholder="Nominee"
                  onChange={onChangeNominee}
                  isDisabled={!values.type}
                />
              </>
            )}
            {!isIssuance && (
              <Select
                name="nomineeid"
                options={getNomineeOptions(cmsUsers.full)}
                placeholder="Nominee"
                isDisabled={!values.type}
              />
            )}
            <TextArea
              name="statement"
              placeholder="Statement"
              id="dcc-statement"
            />
            <Actions>
              <DraftSaver {...{ submitSuccess }} />
              <SubmitButton />
            </Actions>
          </Form>
        );
      }}
    </FormWrapperWithCache>
  );
};

DccFormWrapper.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  history: PropTypes.object,
  cmsUsers: PropTypes.object,
  isUserValid: PropTypes.bool
};

export default withRouter(DccFormWrapper);

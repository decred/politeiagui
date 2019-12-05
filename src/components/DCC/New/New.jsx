import React from "react";
import ReactBody from "react-body";
import { Field, reduxForm } from "redux-form";
import { useNewDCC } from "./hooks";
import dccConnector from "../../../connectors/dcc";
import Message from "../../Message";
import Button from "../../snew/ButtonWithLoadingIcon";
import {
  DCC_TYPE_ISSUANCE,
  DCC_TYPE_REVOCATION
} from "../../../constants";

let NewDCCForm = ({
  newDCCError: error,
  newDCCResponse,
  isLoading,
  ...props
}) => {
  const {
    handleSubmitDCC,
    domainOptions,
    typeOptions,
    requestDone,
    handleSaveDCCDraft: onSaveDraft,
    formValues: values,
    handleChangeInput: onChange,
    savedDraft,
    fakeLoadingDraft: isLoadingDraft
  } = useNewDCC(props);
  return (
    <div className="content" role="main">
      <div className="page submit-proposal-page">
        <ReactBody className="submit-page" />
        {error && (
          <Message type="error" header="New DCC Error" body={error} />
        )}
        {newDCCResponse && requestDone && !error && (
          <Message
            type="success"
            header="New DCC"
            body="DCC Submitted Successfully"
          />
        )}
        {savedDraft && (
          <Message
            type="success"
            header="New DCC Draft"
            body="DCC Draft Saved Successfully"
          />
        )}
        <form className="new-dcc-form" onSubmit={handleSubmitDCC}>
          <div className="new-dcc-title">New DCC</div>
          <label>DCC Type:</label>
          <div className="dcc-type-options">
            <div className="dcc-type">
              <input name="dcctype"
                value={DCC_TYPE_ISSUANCE}
                onChange={onChange("dcctype")}
                checked={+values.dcctype === DCC_TYPE_ISSUANCE}
                tabIndex={4}
                type="radio"
                />
              <label>Issuance</label>
            </div>
            <div className="dcc-type">
              <input
                name="dcctype"
                value={DCC_TYPE_REVOCATION}
                onChange={onChange("dcctype")}
                checked={+values.dcctype === DCC_TYPE_REVOCATION}
                tabIndex={4}
                type="radio"
              />
              <label>Revocation</label>
            </div>
          </div>
          <label>Nominee User ID:</label>
          <Field
            autoFocus
            className="c-form-control"
            id="nomineeid"
            name="nomineeid"
            component="input"
            type="text"
            onChange={onChange("nomineeid")}
            value={values.nomineeid}
            placeholder="The UUID that matches the nominee user"
            // label="Nominee User ID"
            tabIndex={4}
          />
          <label>Statement:</label>
          <Field
            className="c-form-control"
            id="dccstatement"
            name="dccstatement"
            component="textarea"
            onChange={onChange("dccstatement")}
            value={values.dccstatement}
            type="text"
            placeholder="Your statement to support the DCC"
            tabIndex={4}
          />
          <label>Domain:</label>
          <select
            className="c-form-control"
            id="domain"
            name="dccdomain"
            placeholder="Select the DCC domain"
            tabIndex={4}
            onChange={onChange("dccdomain")}
            value={values.dccdomain}
          >
            {domainOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <label>Contractor Type:</label>
          <select
            className="c-form-control"
            id="contractortype"
            name="contractortype"
            placeholder="Select the DCC type"
            onChange={onChange("contractortype")}
            value={values.contractortype}
            tabIndex={4}
          >
            {typeOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="submit-wrapper">
            <Button
              type="submit"
              isLoading={isLoading}
              text="submit"
              value="form"
            />
            <Button
              className="togglebutton secondary access-required"
              text="save draft"
              isLoading={isLoadingDraft}
              onClick={onSaveDraft}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

NewDCCForm = reduxForm({
  form: "form/dcc",
  enableReinitialize: true
})(NewDCCForm);

const NewDCCWrapper = props => {
  const { formValues } = useNewDCC(props);
  return <NewDCCForm {...{ ...props, initialValues: formValues }}/>;
};

export default dccConnector(NewDCCWrapper);

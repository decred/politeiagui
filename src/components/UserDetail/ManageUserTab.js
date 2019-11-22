import React, { useState, useCallback } from "react";
import userConnector from "../../connectors/userCMS";
import * as modalTypes from "../Modal/modalTypes";
import Field, { FieldSeparator } from "../DescriptiveField";
import { Field as ReduxField, reduxForm } from "redux-form";
import Message from "../Message";

const typeOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor"
];

const domainOptions = [
  "No domain defined",
  "Development",
  "Marketing",
  "Design",
  "Research",
  "Documentation",
  "Community Management"
];

const NewSupervisorId = ({ id, onRemoveId, isLast }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className="new-supervisor-id"
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      {id}
      {show && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            onRemoveId(id);
          }}
        >
          ✖
        </span>
      )}
      {!isLast ? "," : "."}
    </span>
  );
};

const ManageUserTab = ({
  manageCmsUserError: error,
  user,
  isAdmin,
  onManageCmsUser,
  manageCmsUserResponse,
  confirmWithModal
}) => {
  const [contractorType, setContractorType] = useState(user.contractortype);
  const [contractorDomain, setContractorDomain] = useState(user.domain);
  const [newSupervisorIds, setNewSupervisorIds] = useState(
    user.supervisoruserids
  );
  const [newSupervisorId, setNewSupervisorId] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAddSupervisorId = e => {
    e.preventDefault();
    const isNewId = newSupervisorIds.indexOf(newSupervisorId) === -1;
    if (isNewId) {
      setNewSupervisorIds([...newSupervisorIds, newSupervisorId]);
      setNewSupervisorId("");
    }
  };

  const handleRemoveId = currentId => {
    const supervisorIdsWithoutCurrentId = newSupervisorIds.filter(
      sid => sid !== currentId
    );
    setNewSupervisorIds(supervisorIdsWithoutCurrentId);
  };

  const handleAddButtonEnabled = () => newSupervisorId !== "";

  const handleManageUser = useCallback(async () => {
    const args = {
      userid: user.userid,
      domain: contractorDomain,
      contractortype: contractorType,
      supervisoruserids: newSupervisorIds
    };

    await onManageCmsUser(args);
    setSuccess(true);
  }, [
    user.userid,
    contractorDomain,
    contractorType,
    newSupervisorIds,
    onManageCmsUser
  ]);

  return (
    <div className="detail-tab-content">
      {isAdmin && (
        <>
          {error && (
            <Message type="error" header="Manage User Error" body={error} />
          )}
          {manageCmsUserResponse && success && !error && (
            <Message
              type="success"
              header="Manage User"
              body="User Updated Successfully"
            />
          )}
          <Field label="User ID">{user.id}</Field>
          <FieldSeparator />
          <Field label="Contractor Type">
            <select
              value={contractorType}
              onChange={event => {
                setContractorType(parseInt(event.target.value));
              }}
            >
              {typeOptions.map((option, i) => (
                <option key={i} value={i}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <FieldSeparator />
          <Field label="Domain">
            <select
              value={contractorDomain}
              onChange={event => {
                setContractorDomain(parseInt(event.target.value));
              }}
            >
              {domainOptions.map((option, i) => (
                <option key={i} value={i}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <FieldSeparator />
          <Field label="User Supervisor IDs">
            {newSupervisorIds.length > 0 ? (
              <>
                IDs:
                {newSupervisorIds.map((id, index) => (
                  <NewSupervisorId
                    id={id}
                    key={index}
                    isLast={index + 1 === newSupervisorIds.length}
                    onRemoveId={handleRemoveId}
                  />
                ))}
                <br />
              </>
            ) : (
              <div>No IDs defined</div>
            )}
            <div className="supervisor-field">
              <ReduxField
                autoFocus
                className="c-form-control"
                id="newsupervisorid"
                name="newsupervisorid"
                component="input"
                type="text"
                placeholder="New Supervisor Id"
                onChange={event => {
                  setNewSupervisorId(event.target.value);
                }}
                tabIndex={4}
              />
              <button
                className="new-supervisor-button"
                disabled={!handleAddButtonEnabled()}
                onClick={handleAddSupervisorId}
              >
                +
              </button>
            </div>
          </Field>
          <FieldSeparator />
          <button
            onClick={() => {
              confirmWithModal(modalTypes.CONFIRM_ACTION, {}).then(ok => {
                if (ok) handleManageUser();
              });
            }}
            type="submit"
          >
            update user
          </button>
        </>
      )}
    </div>
  );
};

export default reduxForm({
  form: "form/user-manage"
})(userConnector(ManageUserTab));

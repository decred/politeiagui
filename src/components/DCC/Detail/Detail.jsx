import React from "react";
import { Link } from "../../snew";
import { DateTooltip } from "snew-classic-ui";
import { useDCCDetails } from "./hooks";
import dccConnector from "../../../connectors/dcc";
import Button from "../../snew/ButtonWithLoadingIcon";
import Message from "../../Message";
import * as modalTypes from "../../Modal/modalTypes";
import { dccChangeStatusList } from "../helpers";

const DCCInfo = ({ label = "", children }) => (
  <div className="dcc-info">
    <label>{label}:</label>
    {children}
  </div>
);

const DCCDetail = props => {
  const {
    dcc,
    status,
    type,
    userCanVote,
    onSupportDCC,
    onOpposeDCC,
    supportOpposeError,
    statusChangeError,
    isLoadingOpposeDCC,
    isLoadingSupportDCC,
    confirmWithModal,
    onChangeDCCStatus,
    isAdmin,
    isActiveDCC,
    cmsType
  } = useDCCDetails(props);
  // FUTURE: Use <RecordWrapper>
  return (
    <div className="content" role="main">
      <div className="dcc-info">
        <Link href="/dccs">Go to DCCs</Link>
      </div>
      {dcc && props.loggedInAsEmail &&
        <>
          {supportOpposeError && (
            <Message type="error" header="DCC Voting Error" body={supportOpposeError} />
          )}
          {statusChangeError && (
            <Message type="error" header="DCC Status Change Error" body={statusChangeError} />
          )}
          <div className="dcc dcc-header">
            <h1>{type} for {dcc.nomineeusername}</h1>
            <span className="status">{status}</span>
            {dcc.timestamp && (
              <div className="submitted-by">
                {"submitted "}
                <DateTooltip createdAt={dcc.timestamp} />
              </div>
            )}
            {isAdmin && isActiveDCC && <div className="dcc-admin-actions">
              {dccChangeStatusList.map(({ label, value: status }, index) => (
                <Button
                  key={index}
                  name={label}
                  text={label}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {
                      reasonPlaceholder:
                        `Please provide a reason to ${label} the DCC`
                    }).then(
                      ({ reason, confirm }) =>
                        confirm && onChangeDCCStatus(status, reason)
                    ) && e.preventDefault()
                  }/>
              ))}
            </div>}
          </div>
          <div className="dcc">
            <h2>Info</h2>
            <DCCInfo label="Nominee">
              {dcc.nomineeusername && <Link href={`/user/${dcc.dccpayload.nomineeuserid}`}>{dcc.nomineeusername}</Link>}
            </DCCInfo>
            <DCCInfo label="Type">{type.toLocaleLowerCase()}</DCCInfo>
            <DCCInfo label="Contractor Type">{cmsType.toLocaleLowerCase()}</DCCInfo>
            <DCCInfo label="Status">{status.toLocaleLowerCase()}</DCCInfo>
            <DCCInfo label="Status change reason">
              {dcc.statuschangereason}
            </DCCInfo>
            <DCCInfo label="Sponsor">
              <Link href={`/user/${dcc.sponsoruserid}`}>{dcc.sponsorusername}</Link>
            </DCCInfo>
            <h2>Statement</h2>
            <p className="dcc-info">{dcc.dccpayload.statement}</p>
            <h2>Votes</h2>
            <DCCInfo label="Support">{dcc.supportuserids.length}</DCCInfo>
            <DCCInfo label="Against">{dcc.againstuserids.length}</DCCInfo>
            <Button
              className={`togglebutton access-required${!userCanVote &&
                " not-active disabled"}`}
              name="support"
              text="Support"
              isLoading={isLoadingSupportDCC}
              onClick={() => {
                confirmWithModal(modalTypes.CONFIRM_ACTION, {
                  message: "Are you sure you want to support this DCC?"
                }).then(ok => ok && onSupportDCC());
              }}
              />
            <Button
              className={`togglebutton access-required${!userCanVote &&
                " not-active disabled"}`}
              name="oppose"
              text="Oppose"
              isLoading={isLoadingOpposeDCC}
              onClick={() => {
                confirmWithModal(modalTypes.CONFIRM_ACTION, {
                  message: "Are you sure you want to oppose this DCC?"
                }).then(ok => ok && onOpposeDCC());
              }}
            />
            {!userCanVote && <span>You have already supported or opposed the given DCC, or either you are the DCC sponsor.</span>}
          </div>
        </>
      }
    </div>
  );
};

export default dccConnector(DCCDetail);

import React from "react";
import { Link } from "../../snew";
import { useDCCDetails } from "../hooks";
import dccConnector from "../../../connectors/dcc";
import Button from "../../snew/ButtonWithLoadingIcon";
// import Card from "../List/Card";

const DCCInfo = ({ label = "", children }) => (
  <div className="dcc-info">
    <label>{label}:</label>
    {children}
  </div>
);

const DCCDetails = props => {
  const { dcc, status, type, userCanVote, onSupportDCC, onOpposeDCC } = useDCCDetails(props);
  // FUTURE: Use <RecordWrapper>
  return (
    <div className="content" role="main">
      {dcc && props.loggedInAsEmail &&
        <>
          <div className="dcc dcc-header">
            <h1>{type} for {dcc.nomineeusername}</h1>
            <span className="status">{status}</span>
          </div>
          <div className="dcc">
            <h2>Info</h2>
            <DCCInfo label="Nominee">
              {dcc.nomineeusername && <Link href={`/user/${dcc.dccpayload.nomineeuserid}`}>{dcc.nomineeusername}</Link>}
            </DCCInfo>
            <DCCInfo label="Type">{type.toLocaleLowerCase()}</DCCInfo>
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
            {/* <Button disabled={!userCanVote}>support</Button><Button disabled={!userCanVote}>oppose</Button> */}
            <Button
              className={`togglebutton access-required${!userCanVote &&
                " not-active disabled"}`}
              name="support"
              text="Support"
              onClick={onSupportDCC}
            />
            <Button
              className={`togglebutton access-required${!userCanVote &&
                " not-active disabled"}`}
              name="oppose"
              text="Oppose"
              onClick={onOpposeDCC}
            />
            {!userCanVote && <span>You have already supported or opposed the given DCC, or either you are the DCC sponsor.</span>}
          </div>
        </>
      }
    </div>
  );
};

export default dccConnector(DCCDetails);

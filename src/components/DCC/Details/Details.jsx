import React from "react";
import { Link } from "../../snew";
import { useDCCDetails } from "../hooks";
import dccConnector from "../../../connectors/dcc";
// import Card from "../List/Card";

const DCCInfo = ({ label = "", children }) => (
  <div className="dcc-info">
    <label>{label}:</label>
    {children}
  </div>
);

const DCCDetails = props => {
  const { dcc, status, type } = useDCCDetails(props);
  // FUTURE: Use <RecordWrapper>
  return (
    <div className="content" role="main">
      {/* {dcc && <Card {...dcc}/>} */}
      <div className="page dcc-details">
        {dcc && (
          <>
            <h2>Info</h2>
            <DCCInfo label="Nominee">
              {dcc.nomineeusername && <Link href={`/user/${dcc.dccpayload.nomineeuserid}`}>{dcc.nomineeusername}</Link>}
            </DCCInfo>
            <DCCInfo label="Type">{type}</DCCInfo>
            <DCCInfo label="Status">{status}</DCCInfo>
            <DCCInfo label="Status change reason">
              {dcc.statuschangereason}
            </DCCInfo>
            <DCCInfo label="Sponsor">
              <Link href={`/user/${dcc.sponsoruserid}`}>{dcc.sponsorusername}</Link>
            </DCCInfo>
            <h2>Statement</h2>
            <span>{dcc.dccpayload.statement}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default dccConnector(DCCDetails);

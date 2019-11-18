import React from "react";
import dccConnector from "../../../connectors/dcc";
import { useListDCC } from "../hooks";
import { DateTooltip } from "snew-classic-ui";
import { Tabs, Tab } from "../../Tabs";
import {
  DCC_STATUS_ACTIVE,
  DCC_STATUS_SUPPORTED,
  DCC_STATUS_APPROVED,
  DCC_STATUS_REJECTED,
  DCC_STATUS_DEBATE,
  DCC_TYPE_ISSUANCE,
  DCC_TYPE_REVOCATION
} from "../../../constants";

const statusForDCC = [
  {
    label: "active",
    value: DCC_STATUS_ACTIVE
  },
  {
    label: "supported",
    value: DCC_STATUS_SUPPORTED
  },
  {
    label: "approved",
    value: DCC_STATUS_APPROVED
  },
  {
    label: "rejected",
    value: DCC_STATUS_REJECTED
  },
  {
    label: "debate",
    value: DCC_STATUS_DEBATE
  }
];

const typesForDCC = {
  [DCC_TYPE_ISSUANCE]: "Issuance",
  [DCC_TYPE_REVOCATION]: "Revocation"
};

const CardDCC = ({ status, dccpayload, sponsoruserid, sponsorusername, censorshiprecord: { token }, timestamp }) => {
  const isDCCApproved = status === DCC_STATUS_APPROVED,
    isDCCActive = status === DCC_STATUS_ACTIVE,
    isDCCSupported = status === DCC_STATUS_SUPPORTED;

  const { type, nomineeuserid, statement, domain } = dccpayload;

  return (
    <div className={`thing thing-proposal id-${token} odd link`}>
      <span
        className="title"
        style={{ display: "flex", overflow: "visible" }}
      >
        <a className="title may-blank loggedin" href={`/dcc/${token}`}>
          {nomineeuserid}
        </a>
      </span>
      <span
        style={{ display: "flex", flexDirection: "column" }}
        className="tagline"
      >
        <span className="submitted-by">
          {sponsorusername && (
            <span>
              {" by "}
              <a href={`/user/${sponsoruserid}`}>{sponsorusername}</a>
            </span>
          )}
        </span>
        {timestamp && (
          <span className="submitted-by">
            {"submitted "}
            <DateTooltip createdAt={timestamp} />
          </span>
        )}
        {type && (
          <span>{typesForDCC[type]}</span>
        )}
      </span>
    </div>
  );
};

const ListDCC = props => {
  const { orderedDCCs: dccs, handleStatusChange, status } = useListDCC(props);
  return (
    <div className="content" role="main">
      <div className="page ">
        <h1>
          DCCs
        </h1>
        <Tabs>
          {statusForDCC.map(st => (
            <Tab
              key={st.value}
              title={st.label}
              selected={status === st.value}
              onTabChange={() => handleStatusChange(st.value)}
            />
          ))}
        </Tabs>
        {dccs && dccs.length > 0 && dccs.map((dcc, i) => (
          <CardDCC {...dcc} key={i}/>
        ))}
      </div>
    </div>
  );
};

export default dccConnector(ListDCC);

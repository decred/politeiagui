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
  DCC_TYPE_REVOCATION,
  CMS_DOMAINS
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

const CardDCC = ({ dccpayload, sponsoruserid, sponsorusername, censorshiprecord: { token }, timestamp }) => {
  const { type, nomineeuserid, domain } = dccpayload;

  return (
    <div className={`thing thing-proposal id-${token} odd link`}>
      <span
        className="title"
        style={{ display: "flex", overflow: "visible" }}
      >
        <a className="title may-blank loggedin" href={`/dcc/${token}`}>
          {type && <span>{typesForDCC[type]}</span>}: {nomineeuserid}
        </a>
      </span>
      <span
        style={{ display: "flex", flexDirection: "column" }}
        className="tagline"
      >
        {domain && (
          <span>domain: {CMS_DOMAINS[domain].toLocaleLowerCase()}</span>
        )}
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
      </span>
    </div>
  );
};

const ListDCC = props => {
  const { orderedDCCs: dccs, handleStatusChange, status, loadingDCCs: isLoading } = useListDCC(props);
  const dccsAvailable = dccs && dccs.length > 0 && !isLoading;
  const emptyDCCList = dccs && dccs.length === 0 && !isLoading;
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
        {dccsAvailable && dccs.map((dcc, i) => (
          <CardDCC {...dcc} key={i}/>
        ))}
        {emptyDCCList && (
          <span>No DCCs Available Here</span>
        )}
        {isLoading && (
          <i
            className="fa fa-circle-o-notch fa-spin left-margin-5"
            style={{ fontSize: "14px" }}
          />
        )}
      </div>
    </div>
  );
};

export default dccConnector(ListDCC);

import React from "react";
import dccConnector from "../../../connectors/dcc";
import { useListDCC } from "./hooks";
import { Tabs, Tab } from "../../Tabs";
import { dccStatusList } from "../helpers";
import { DCC_STATUS_DRAFTS } from "../../../constants";
import { CardDCC, CardDraft } from "./Card";
import * as modalTypes from "../../Modal/modalTypes";

const ListDCC = ({ dccs, isLoading }) => {
  const emptyDCCList = dccs && dccs.length === 0 && !isLoading;
  const dccsAvailable = dccs && dccs.length > 0 && !isLoading;
  return <>
    {dccsAvailable && dccs.map((dcc, i) => (
      <CardDCC {...dcc} key={i}/>
    ))}
    {emptyDCCList && (
      <span>No DCCs Available Here</span>
    )}
  </>;
};

const ListDraft = ({ drafts, onDeleteDraft }) => {
  const draftList = Object.keys(drafts).reduce((acc, id, index) =>
    drafts[id] && drafts[id].timestamp ?
      [
        ...acc,
        <CardDraft
          key={index}
          draftId={id}
          onDeleteDraft={onDeleteDraft(id)}
          timestamp={drafts[id].timestamp}
          statement={drafts[id].statement}
        />
      ] :
      acc,
    []
  );
  return draftList.length > 0 ? draftList : (<span>No Drafts Available Here</span>);
};


const ListWrapper = props => {
  const {
    orderedDCCs: dccs,
    handleStatusChange,
    status,
    loadingDCCs: isLoading,
    onRefreshDCCs,
    drafts,
    onDeleteDraft,
    confirmWithModal
  } = useListDCC(props);
  const isDraftOption = status === DCC_STATUS_DRAFTS;
  return (
    <div className="content" role="main">
      <div className="page ">
        <h1>DCCs</h1>
        {!isDraftOption && <div className="refresh" onClick={onRefreshDCCs}>
          Refresh
        </div>}
        <Tabs>
          {dccStatusList.map(st => (
            <Tab
              key={st.value}
              title={st.label}
              selected={status === st.value}
              onTabChange={() => handleStatusChange(st.value)}
            />
          ))}
          <div style={{ float: "right" }}>
            <Tab
              title="drafts"
              selected={isDraftOption}
              onTabChange={() => handleStatusChange(DCC_STATUS_DRAFTS)}
            />
          </div>
        </Tabs>
        {isDraftOption ?
          <ListDraft drafts={drafts || {}} onDeleteDraft={id => e => {
            confirmWithModal(modalTypes.CONFIRM_ACTION, {
              message: "Are you sure you want to delete this DCC?"
            }).then(ok => ok && onDeleteDraft(id)) && e.preventDefault();
          }}/> :
          <ListDCC dccs={dccs} isLoading={isLoading}/>
        }
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

export default dccConnector(ListWrapper);

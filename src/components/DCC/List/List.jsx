import React from "react";
import dccConnector from "../../../connectors/dcc";
import { useListDCC } from "./hooks";
import { Tabs, Tab } from "../../Tabs";
import { dccStatusList } from "../helpers";
import { DCC_STATUS_DRAFTS } from "../../../constants";
import { CardDCC, CardDraft } from "./Card";
import * as modalTypes from "../../Modal/modalTypes";
import flow from "lodash/fp/flow";
import keys from "lodash/fp/keys";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";

const ListDCC = ({ dccs = ([]), isLoading }) => {
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

const ListDraft = ({ drafts = ({}), onDeleteDraft }) => {
  const draftList = flow(
    keys,
    filter(id => drafts[id] && drafts[id].timestamp),
    map((id, index) => <CardDraft
      key={index}
      draftId={id}
      onDeleteDraft={onDeleteDraft(id)}
      timestamp={drafts[id].timestamp}
      statement={drafts[id].statement}
    />)
  )(drafts);
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
          <div className="draftTab">
            <Tab
              title="drafts"
              selected={isDraftOption}
              onTabChange={() => handleStatusChange(DCC_STATUS_DRAFTS)}
            />
          </div>
        </Tabs>
        {isDraftOption ?
          <ListDraft drafts={drafts} onDeleteDraft={id => e => {
            confirmWithModal(modalTypes.CONFIRM_ACTION, {
              message: "Are you sure you want to delete this DCC draft?"
            }).then(ok => ok && onDeleteDraft(id)) && e.preventDefault();
          }}/> :
          <ListDCC dccs={dccs} isLoading={isLoading}/>
        }
        {isLoading && (
          <i
            className="loadingIcon fa fa-circle-o-notch fa-spin left-margin-5"
          />
        )}
      </div>
    </div>
  );
};

export default dccConnector(ListWrapper);

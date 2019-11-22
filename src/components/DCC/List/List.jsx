import React from "react";
import dccConnector from "../../../connectors/dcc";
import { useListDCC } from "../hooks";
import { Tabs, Tab } from "../../Tabs";
import { dccStatusList } from "../helpers";
import Card from "./Card";


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
          {dccStatusList.map(st => (
            <Tab
              key={st.value}
              title={st.label}
              selected={status === st.value}
              onTabChange={() => handleStatusChange(st.value)}
            />
          ))}
        </Tabs>
        {dccsAvailable && dccs.map((dcc, i) => (
          <Card {...dcc} key={i}/>
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

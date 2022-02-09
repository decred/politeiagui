import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store, connectReducers } from "@politeiagui/core";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteConstants } from "../../ticketvote";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { TicketvoteRecordsList } from "../../ui";

import { PiThemeWrapper } from "../theme";

const AllStatusPage = async () => {
  await connectReducers(ticketvoteConstants.reducersArray);
  await store.dispatch(ticketvotePolicy.fetch());
  await store.dispatch(recordsPolicy.fetch());
  const statuses = [
    "unauthorized",
    "authorized",
    "approved",
    "started",
    "rejected",
    "ineligible",
  ];
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <TicketvoteRecordsList status={statuses[0]}></TicketvoteRecordsList>
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

export default AllStatusPage;

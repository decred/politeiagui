import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, connectReducers } from "@politeiagui/core";
import { H1 } from "pi-ui";

import { ticketvotePolicy } from "../../ticketvote/policy";

import { ticketvoteConstants } from "../../ticketvote";

import { PiThemeWrapper } from "../theme";
import {
  TicketvoteSummariesWrapper,
  TicketvoteRecordVoteStatusBar,
} from "../../ui";

const DetailsPage = async ({ token }) => {
  if (!token) {
    ReactDOM.render(<h1>No records found</h1>, document.querySelector("#root"));
    return;
  }
  await connectReducers(ticketvoteConstants.reducersArray);
  await store.dispatch(ticketvotePolicy.fetch());
  ReactDOM.render(
    <PiThemeWrapper>
      <Provider store={store}>
        <div style={{ margin: "2rem" }}>
          <H1>Ticketvote Details for {token}</H1>
          <TicketvoteSummariesWrapper tokens={[token]}>
            {(summariesProps) => {
              const summary = summariesProps.allSummaries[token];
              return (
                <TicketvoteRecordVoteStatusBar ticketvoteSummary={summary} />
              );
            }}
          </TicketvoteSummariesWrapper>
        </div>
      </Provider>
    </PiThemeWrapper>,
    document.querySelector("#root")
  );
};

export default DetailsPage;

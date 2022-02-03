import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store, connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "../../ticketvote";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { TicketvoteRecordsList, TicketvoteRecordVoteStatusBar } from "../../ui";

import { PiThemeWrapper } from "../theme";
import { Button, H2, H1 } from "pi-ui";

const AllStatusPage = async () => {
  await connectReducers(ticketvoteConstants.reducersArray);
  await store.dispatch(ticketvotePolicy.fetch());
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
        <TicketvoteRecordsList statuses={statuses}>
          {({ inventory, summaries, status }) => {
            return (
              <div>
                <H1>{status}</H1>
                {inventory.inventory.map((token, key) => {
                  const summary = summaries.allSummaries[token];
                  return (
                    summary && (
                      <div key={key} style={{ marginBottom: "1rem" }}>
                        <H2>
                          {key} Summary for {token}
                        </H2>

                        <TicketvoteRecordVoteStatusBar
                          ticketvoteSummary={summary}
                        />
                      </div>
                    )
                  );
                })}
                <Button onClick={summaries.onFetchSummariesNextPage}>
                  Fetch Next
                </Button>
              </div>
            );
          }}
        </TicketvoteRecordsList>
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

export default AllStatusPage;

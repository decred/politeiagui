import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "@politeiagui/core";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { ticketvoteConnectReducers } from "../../ticketvote/helpers";
import { TicketvoteRecordsList, TicketvoteRecordVoteStatusBar } from "../../ui";

import { PiThemeWrapper } from "../theme";
import { Button, H2, H1 } from "pi-ui";

const AllStatusPage = async () => {
  await ticketvoteConnectReducers();
  await store.dispatch(ticketvotePolicy.fetch());
  const statuses = [
    "unauthorized",
    "authorized",
    "approved",
    "started",
    "rejected",
  ];
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <TicketvoteRecordsList statuses={statuses}>
          {({ inventory, summaries }) => {
            return (
              <div>
                <H1>{inventory.status}</H1>
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

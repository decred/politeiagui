import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "@politeiagui/core";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { ticketvoteConnectReducers } from "../../ticketvote/helpers";
import { TicketvoteRecordsList } from "../../ui";

import { PiThemeWrapper } from "../theme";

const UnderReviewPage = async () => {
  await ticketvoteConnectReducers();
  await store.dispatch(ticketvotePolicy.fetch());
  const statuses = ["started", "authorized", "unauthorized"];
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <TicketvoteRecordsList statuses={statuses}>
          {({ inventory, summaries }) => {
            return inventory.tokens.map((token, key) => (
              <div key={key}>{token}</div>
            ));
          }}
        </TicketvoteRecordsList>
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

export default UnderReviewPage;

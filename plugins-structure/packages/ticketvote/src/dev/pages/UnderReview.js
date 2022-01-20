import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, connectReducers } from "@politeiagui/core";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { ticketvoteConstants } from "../../ticketvote";
import { TicketvoteRecordsList } from "../../ui";
import { PiThemeWrapper } from "../theme";

const UnderReviewPage = async () => {
  await connectReducers(ticketvoteConstants.reducersArray);
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

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { connectReducers, store } from "@politeiagui/core";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteConstants } from "../../ticketvote";
import { ticketvotePolicy } from "../../ticketvote/policy";
import { TicketvoteRecordsList } from "../../ui";
// Improve visual theming
import { PiThemeWrapper } from "../theme";

const AllStatusPage = async () => {
  // Before dispatching any actions, we need to connect the ticketvote reducers
  // into the core store.
  await connectReducers(ticketvoteConstants.reducersArray);
  // We can only perform fetch actions with all policies loaded, because the
  // async thunks will require some extra parameters defined by each plugin's
  // policy rules
  await store.dispatch(ticketvotePolicy.fetch());
  await store.dispatch(recordsPolicy.fetch());
  // Render AllStatusPage component
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <TicketvoteRecordsList status={"unauthorized"} />
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

export default AllStatusPage;

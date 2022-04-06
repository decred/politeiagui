import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { connectReducers } from "@politeiagui/core";
import { UiTheme, themeReducer } from "@politeiagui/common-ui/layout";
import pick from "lodash/fp/pick";
import values from "lodash/fp/values";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
// policies
import { commentsPolicy } from "@politeiagui/comments/policy";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { piPolicy } from "../pi";

const mapLabelToPolicyFetch = {
  comments: () => store.dispatch(commentsPolicy.fetch()),
  ticketvote: () => store.dispatch(ticketvotePolicy.fetch()),
  records: () => store.dispatch(recordsPolicy.fetch()),
  pi: () => store.dispatch(piPolicy.fetch()),
};

function fetchPolicies(policies) {
  const policiesPromises = compose(
    map((fn) => fn()),
    values,
    pick(policies)
  )(mapLabelToPolicyFetch);
  return Promise.all(policiesPromises);
}

export function createAppRoute({
  path,
  reducers,
  requiredPolicies = [],
  Component,
  rootId = "#root",
}) {
  return {
    path,
    view: async (params) => {
      await connectReducers([
        ...(reducers || []),
        { key: "uiTheme", reducer: themeReducer },
      ]);
      await fetchPolicies(requiredPolicies);
      return ReactDOM.render(
        <Provider store={store}>
          <UiTheme>
            <Component {...params} />
          </UiTheme>
        </Provider>,
        document.querySelector(rootId)
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector(rootId)),
  };
}

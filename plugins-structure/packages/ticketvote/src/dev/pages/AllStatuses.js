import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createAction } from "@reduxjs/toolkit";
import { store } from "@politeiagui/core";
// Improve visual theming
import { PiThemeWrapper } from "../theme";
// App
import App from "../app";
import * as ctes from "../../lib/constants";
import { getHumanReadableTicketvoteStatus } from "../../lib/utils";
import { ticketvote } from "../../ticketvote";
// Actions
const fetchInventory = createAction("ticketvoteDev/fetchInventory");

const statuses = [
  ctes.TICKETVOTE_STATUS_UNAUTHORIZED,
  ctes.TICKETVOTE_STATUS_AUTHORIZED,
  ctes.TICKETVOTE_STATUS_FINISHED,
  ctes.TICKETVOTE_STATUS_APPROVED,
  ctes.TICKETVOTE_STATUS_REJECTED,
  ctes.TICKETVOTE_STATUS_STARTED,
  ctes.TICKETVOTE_STATUS_INELIGIBLE,
];

function AllStatusList() {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);

  const inventory = useSelector((state) =>
    ticketvote.inventory.selectByStatus(state, statuses[index])
  );

  useEffect(() => {
    dispatch(fetchInventory({ status: statuses[index], page }));
  }, [index, page, dispatch]);

  return (
    <div style={{ margin: "4rem" }}>
      <div style={{ display: "flex" }}>
        {statuses.map((status, i) => (
          <div
            key={i}
            style={{ margin: "1rem" }}
            onClick={() => {
              setIndex(i);
              setPage(1);
            }}
          >
            <span
              style={
                index === i
                  ? { borderBottom: "2px solid red" }
                  : { cursor: "pointer" }
              }
            >
              {getHumanReadableTicketvoteStatus(status)}
            </span>
          </div>
        ))}
      </div>
      {inventory && inventory.length === 0 && <div> No Tokens</div>}
      <ol>
        {inventory && inventory.map((token) => <li key={token}>{token}</li>)}
      </ol>
      <button onClick={() => setPage(page + 1)}>Next page</button>
    </div>
  );
}

const AllStatusPage = () => {
  // Render AllStatusPage component
  ReactDOM.render(
    <Provider store={store}>
      <PiThemeWrapper>
        <h3>Ticketvote Plugin Showcase</h3>
        <AllStatusList />
      </PiThemeWrapper>
    </Provider>,
    document.querySelector("#root")
  );
};

function injectPayloadEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, payload);
    subscribe();
  };
}

const fetchInventoryListenerCreator = {
  actionCreator: fetchInventory,
  injectEffect: injectPayloadEffect,
};

export default App.createRoute({
  path: "/",
  view: AllStatusPage,
  setupServices: [
    {
      id: "ticketvote/inventory",
      listenerCreator: fetchInventoryListenerCreator,
    },
  ],
});

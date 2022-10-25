import React from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "@politeiagui/core";
import App from "./app";
import { services } from "./playground";

import { createAction } from "@reduxjs/toolkit";
const root = document.querySelector("#root");

const trigger = createAction("trigger");
const withoutPrepare = createAction("withoutPrepare");

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>toolkit-playground HOME PAGE</h1>
      <button onClick={() => dispatch(trigger("37558e28902ec56a"))}>
        Trigger
      </button>
      <button
        onClick={() => dispatch(withoutPrepare("PAYLOAD Without prepare"))}
      >
        Without Prepare
      </button>
    </div>
  );
};

function cleanup() {
  return ReactDOM.unmountComponentAtNode(root);
}

const { foo, create, effectWithoutPrepare } = services.setups;

const serviceFoo = foo
  .listenTo({ actionCreator: trigger })
  .customizeEffect((effect, { payload }, { dispatch, getState }) => {
    effect(getState(), dispatch, { token: payload });
  });

const serviceEffectWithoutPrepare = effectWithoutPrepare.listenTo({
  actionCreator: withoutPrepare,
});

console.log({ serviceEffectWithoutPrepare });

const appRoutes = [
  App.createRoute({
    path: "/",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Home />
        </Provider>,
        root
      ),
    cleanup,
    setupServices: [serviceEffectWithoutPrepare, serviceFoo, create],
  }),
];

App.init({ routes: appRoutes });

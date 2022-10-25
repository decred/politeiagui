import React from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "@politeiagui/core";
import App from "./app";
import { createAction } from "@reduxjs/toolkit";
import { services } from "./playground";

const root = document.querySelector("#root");
function cleanup() {
  return ReactDOM.unmountComponentAtNode(root);
}

// Actions to test against playground services
const prepareFetchRecord = createAction("prepareFetchRecord");
const withoutCustomEffect = createAction("withoutCustomEffect");

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>toolkit-playground HOME PAGE</h1>
      <button
        onClick={() =>
          dispatch(prepareFetchRecord({ token: "37558e28902ec56a" }))
        }
      >
        Fetch Record
      </button>
      <button
        onClick={() =>
          dispatch(withoutCustomEffect("PAYLOAD Without customization"))
        }
      >
        Without Customization
      </button>
    </div>
  );
};

// Get services setup
const { foo, create, effectWithoutCustomization } = services.setups;

// Setup service foo
const serviceFoo = foo
  .listenTo({ actionCreator: prepareFetchRecord })
  // Add custom effect to our service
  .customizeEffect((effect, { payload }, { dispatch, getState }) => {
    effect(getState(), dispatch, payload);
  });

// Setup service without custom effects. This will pass the action payload
// to our service effect.
const serviceEffectWithoutCustomization = effectWithoutCustomization.listenTo({
  actionCreator: withoutCustomEffect,
});

// this service will not have any listeners, but this will trigger the service
// `action` to execute on service match.
const serviceCreate = create;

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
    setupServices: [
      serviceEffectWithoutCustomization,
      serviceFoo,
      serviceCreate,
    ],
  }),
];

// Initialize our app
App.init({ routes: appRoutes });

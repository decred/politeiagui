import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";

// lazy load the v2 so it doesn't affect the app bundle size
// and the styles from old version doesn't affect v2
const AppV2 = lazy(() => import(/* webpackChunkName: "Appv2" */ "src/Appv2"));
const App = lazy(() => import(/* webpackChunkName: "App" */ "./App"));

// This is a temporary hook
const WhichApp = () => {
  return (
    <Suspense fallback={<div />}>
      {process.env.REACT_APP_V2 ? <AppV2 /> : <App />}
    </Suspense>
  );
};

const targetElement =
  process.env.REACT_APP_V2 || process.env.NODE_ENV === "test"
    ? document.getElementById("root")
    : document.body;

ReactDOM.render(<WhichApp />, targetElement);

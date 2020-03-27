import React from "react";
import { BrowserRouter as ReactRouter } from "react-router-dom";
import RouterProvider from "./RouterProvider";

const Router = ({ children }) => (
  <ReactRouter>
    <RouterProvider>{children}</RouterProvider>
  </ReactRouter>
);

export default Router;

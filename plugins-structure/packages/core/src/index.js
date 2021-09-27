export * from "./storeSetup";
export * from "./utils";
export * from "./router/router";
export * from "./api/apiSlice";
export * from "./api/useFetchApi";
// those exports make @babel/preset-react required
// on plugins because routes and ui use JSX.
// TODO: research a way to eliminate the need of
// @babel/preset-react
export * from "./records";
export * from "./routes/routes";

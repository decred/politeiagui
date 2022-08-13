export * from "./records";

export function mockApi({
  mode = "mock_mode",
  activeusersession = false,
} = {}) {
  return () => ({
    version: 1,
    route: "/v1",
    buildversion: "(devel)",
    pubkey: "853b4ab7ac5b3a24f9678c63bc6bedf7d31565bf18f69bdb2a2a76fcc662192f",
    testnet: true,
    mode,
    activeusersession,
  });
}

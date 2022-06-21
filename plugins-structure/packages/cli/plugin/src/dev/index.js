// @politeiagui/core is available for the plugin usage
import { appSetup, store } from "@politeiagui/core";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import MyPlugin from "../";

const publicRecord = {
  recordsState: "vetted",
  status: "public",
};

const navLinks = `<nav>
<a href="/" data-link>Home Page</a>
<a href="/__PLUGIN_NAME__" data-link>__PLUGIN_NAME__ Page</a>
</nav>`;

function __PLUGIN_NAME__Page() {
  return `${navLinks}
  <h1>__PLUGIN_NAME__ PAGE</h1>`;
}

async function HomePage() {
  // Select API status for public records
  const publicRecordsInventoryStatus = recordsInventory.selectStatus(
    store.getState(),
    publicRecord
  );
  // idle state means API has not been initialized yet
  if (publicRecordsInventoryStatus === "idle") {
    await store.dispatch(recordsInventory.fetch(publicRecord));
  }
  const inventory = recordsInventory.selectByStateAndStatus(
    store.getState(),
    publicRecord
  );
  return `
  ${navLinks}
  <h1>__PLUGIN_NAME__ Home</h1>
  <h2>Public Tokens</h2>
  <ol>
    ${inventory.map((token) => `<li>${token}</li>`).join("")}
  </ol>
  `;
}

const MyDevApp = appSetup({
  plugins: [MyPlugin],
  config: {
    name: "__PLUGIN_NAME__ App Example",
  },
});

// Routes for __PLUGIN_NAME__ plugin
const routes = [
  MyDevApp.createRoute({
    path: "/__PLUGIN_NAME__",
    view: async () => {
      document.querySelector("#root").innerHTML = __PLUGIN_NAME__Page();
    },
    initializerIds: ["__PLUGIN_NAME__/reset"],
  }),
  MyDevApp.createRoute({
    path: "/",
    view: async () => {
      document.querySelector("#root").innerHTML = await HomePage();
    },
    initializerIds: ["records/inventory", "__PLUGIN_NAME__/setname"],
  }),
];

MyDevApp.init({ routes });

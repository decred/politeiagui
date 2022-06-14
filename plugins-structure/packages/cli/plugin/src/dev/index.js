// @politeiagui/core is available for the plugin usage
import { appSetup, store } from "@politeiagui/core";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import MyPlugin from "../";

const publicRecord = {
  recordsState: "vetted",
  status: "public",
};

const navLinks = `<nav>
<a href="/">Home Page</a>
<a href="/__PLUGIN_NAME__">__PLUGIN_NAME__ Page</a>
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
  <nav>
    <a href="/">Home Page</a>
    <a href="/__PLUGIN_NAME__">__PLUGIN_NAME__ Page</a>
  </nav>
  <h1>__PLUGIN_NAME__ Home</h1>
  <h2>Public Tokens</h2>
  <ol>
    ${inventory.map((token) => `<li>${token}</li>`).join("")}
  </ol>
  `;
}

// Routes for __PLUGIN_NAME__ plugin
const routes = [
  {
    path: "/__PLUGIN_NAME__",
    view: async () => {
      document.querySelector("#root").innerHTML = __PLUGIN_NAME__Page();
    },
  },
  {
    path: "/",
    view: async () => {
      document.querySelector("#root").innerHTML = await HomePage();
    },
  },
];

const MyDevApp = appSetup({
  plugins: [MyPlugin],
  pluginsProxyMap: {
    "/": ["/records/batch", "/records/inventory", "/__PLUGIN_NAME__/setname"],
  },
  viewRoutes: routes,
});

MyDevApp.init();

import { appSetup } from "@politeiagui/core";
// App Plugins __PLUGINS_IMPORTS__

const App = appSetup({
  /* Connect your plugins here */
  plugins: ["__PLUGINS_CONNECTED__"],
  /* App extra config */
  config: {
    name: "__APP_NAME__",
  },
});

export default App;

import { appSetup } from "@politeiagui/core";
// App Plugins
import { plugin } from "./playground";

const App = appSetup({
  /* Connect your plugins here */
  plugins: [plugin],
  /* App extra config */
  config: {
    name: "toolkit-playground",
  },
});

export default App;

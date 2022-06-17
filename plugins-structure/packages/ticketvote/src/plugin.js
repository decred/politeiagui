import { pluginSetup } from "@politeiagui/core";
import { ticketvoteConstants } from "./ticketvote";
import { routes } from "./routes";

// Declare ticketvote plugin interface
const TicketvotePlugin = pluginSetup({
  routes,
  reducers: ticketvoteConstants.reducersArray,
  name: "ticketvote",
});

export default TicketvotePlugin;

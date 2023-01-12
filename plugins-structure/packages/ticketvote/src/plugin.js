import { pluginSetup } from "@politeiagui/core";
import { ticketvoteConstants } from "./ticketvote";
import { pluginServices } from "./ticketvote/services";

// Declare ticketvote plugin interface
const TicketvotePlugin = pluginSetup({
  services: pluginServices,
  reducers: ticketvoteConstants.reducersArray,
  name: "ticketvote",
});

export default TicketvotePlugin;

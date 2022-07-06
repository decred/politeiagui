import { pluginSetup } from "@politeiagui/core";
import { ticketvoteConstants } from "./ticketvote";
import { services } from "./ticketvote/services";

// Declare ticketvote plugin interface
const TicketvotePlugin = pluginSetup({
  services,
  reducers: ticketvoteConstants.reducersArray,
  name: "ticketvote",
});

export default TicketvotePlugin;

import { pluginSetup } from "@politeiagui/core";
import { ticketvoteConstants } from "./ticketvote";
import { initializers } from "./initializers";

// Declare ticketvote plugin interface
const TicketvotePlugin = pluginSetup({
  initializers,
  reducers: ticketvoteConstants.reducersArray,
  name: "ticketvote",
});

export default TicketvotePlugin;

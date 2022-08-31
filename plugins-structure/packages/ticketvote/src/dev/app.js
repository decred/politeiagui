import { appSetup } from "@politeiagui/core";
import TicketvotePlugin from "../";
// import { routes } from "../routes";

export default appSetup({
  plugins: [TicketvotePlugin],
  config: { name: "Ticketvote App Showcase" },
});

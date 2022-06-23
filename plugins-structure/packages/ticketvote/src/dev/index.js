import { appSetup } from "@politeiagui/core";
import TicketvotePlugin from "../";
import { routes } from "../routes";

const TicketvoteApp = appSetup({
  plugins: [TicketvotePlugin],
  config: { name: "Ticketvote App Showcase" },
});

TicketvoteApp.init({ routes });

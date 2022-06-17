import { appSetup } from "@politeiagui/core";
import TicketvotePlugin from "../";
import { routes } from "../routes";

async function initializeApp() {
  const App = await appSetup({
    plugins: [TicketvotePlugin],
    routes,
  });
  App.init();
}

initializeApp();

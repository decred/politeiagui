# Test Setup App

This app is used to describe the new plugins + app-shell integration. First,
let's understand a little bit about the issues on politeia app-shell setup:

## Current Issues

### Multiple plugins inputs

We don't have a single input for plugins configuration, forcing us to define
which plugins are being executed on the app during the routes setup. It
basically makes the `createAppRoute` function a must-have tool on our setup.

With multiple plugins inputs, we cannot assert the "plug and play" behavior for
the plugins.

### Routing conflicts

Also, plugins routes were being merged along with app view routes, all together
in the same router, causing multiple conflicts issues when dealing with multiple
plugins. **This approach is good for decoupling**, but it actually forces
plugins to have well defined routes so further apps can use them without
conflicting them on the same router setup.

For example, if we have two different apps that uses the `ticketvote` plugin,
every defined route on the plugin should match at least the app-shell UI design.
In this case, if App A uses a different design from B, we would have to either
force the UI styling or create a new reduntant component from scratch. I
honestly think this is unsustainable in terms of development experience.

### Plug and Play

Some of our plugins tools require some prior information loaded in order to
execute some actions. For example, the ticketvote inventory plugin needs to have
the ticketvote policy previously loaded, in order to properly paginate requests.

When we talk about something that is "plug and play", we should assert that some
plugin will have a default behavior without needing to configure anything. Just
plug and play :).

## Solution

### Plugins Router

Having an specific router for each plugin is good for decoupling, but since
dealing with multiple sources of view will almost cause some trouble for us,
I decided to implement a background router, where plugins can listen to route
changes and trigger actions/side-effects. This way we can ensure some plugin
is initiated and ready to be executed for some given route.

### Proxy

The app shell is able set which routes will execute and be configured for an
specific plugin. In that way, we can use a **proxy map** to redirect an app
route to some plugin route on the app shell setup.

Example:

> By default, plugin will be configured for its own routes. In order to
> force a diffrerent behavior from plugin's default, you can use a proxy to
> redirect the setup to an app route. For example: we can setup the
> ticketvote inventory on home page by proxying the `/ticketvote/inventory`
> route to `/`, and we should have it all ready to play on `/`.

```javascript
const pluginsProxyConfig = {
  "/": ["/ticketvote/inventory", "/ticketvote/summaries"],
  "/record/:id": ["/ticketvote/summaries", "/ticketvote/timestamps"],
  "/app": ["/ticketvote/inventory", "/ticketvote/summaries"],
};

const App = await appSetup({
  plugins: [TicketvotePlugin],
  pluginsProxyConfig,
  viewRoutes,
});
```

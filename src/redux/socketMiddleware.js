import * as act from "src/actions";

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket open", event.target.url);
    store.dispatch(act.onWsConnected(event.target.url));
    // subscribe to `quiesce` event
    socket.send(
      JSON.stringify({
        command: "subscribe",
        id: "1"
      })
    );
    socket.send(
      JSON.stringify({
        rpcs: ["quiesce"]
      })
    );
  };

  const onClose = (store) => () => {
    store.dispatch(act.onWsDisconnected());
  };

  let commandRecieved = "";
  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    console.log("receiving server message");
    // command message
    if (payload.command && !commandRecieved) {
      commandRecieved = payload.command;
    } else {
      // command body message
      switch (commandRecieved) {
        case "quiesce":
          store.dispatch(act.toggleQuiesceMode(payload.quiesce));
          break;
        default:
      }
      commandRecieved = "";
    }
  };

  // the middleware part of this function
  return (store) => (next) => (action) => {
    switch (action.type) {
      case "WS_CONNECT":
        if (socket !== null) {
          socket.close();
        }

        // connect to the remote host
        socket = new WebSocket(action.payload.host);

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);

        break;
      case "WS_DISCONNECT":
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log("websocket closed");
        break;
      case "NEW_MESSAGE":
        // xxx cleanup?
        console.log("sending a message", action.msg);
        socket.send(
          JSON.stringify({ command: "NEW_MESSAGE", message: action.msg })
        );
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();

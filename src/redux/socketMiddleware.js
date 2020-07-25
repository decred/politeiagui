import * as act from "src/actions";

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket open", event.target.url);
    store.dispatch(act.onWsConnected(event.target.url));
  };

  const onClose = (store) => () => {
    store.dispatch(act.onWsDisconnected());
  };

  const onMessage = () => (event) => {
    const payload = JSON.parse(event.data);
    console.log("receiving server message");
    console.log(event);
    console.log(payload);
    // XXX on handle quiesce message
    // switch (payload.type) {
    //   case "update_game_players":
    //     store.dispatch(updateGame(payload.game, payload.current_player));
    //     break;
    //   default:
    //     break;
    // }
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
        console.log("sending a message", action.msg);
        socket.send(
          JSON.stringify({ command: "NEW_MESSAGE", message: action.msg })
        );
        break;
      default:
        console.log("the next action:", action);
        return next(action);
    }
  };
};

export default socketMiddleware();

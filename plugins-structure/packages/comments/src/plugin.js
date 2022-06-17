import { pluginSetup } from "@politeiagui/core";
import { routes } from "./routes";
import { commentsConstants } from "./comments";

const CommentsPlugin = pluginSetup({
  routes,
  reducers: commentsConstants.reducersArray,
  name: "comments",
});

export default CommentsPlugin;

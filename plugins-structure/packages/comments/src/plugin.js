import { pluginSetup } from "@politeiagui/core";
import { initializers } from "./initializers";
import { commentsConstants } from "./comments";

const CommentsPlugin = pluginSetup({
  initializers,
  reducers: commentsConstants.reducersArray,
  name: "comments",
});

export default CommentsPlugin;

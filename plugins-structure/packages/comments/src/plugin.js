import { pluginSetup } from "@politeiagui/core";
import { services } from "./comments/services";
import { commentsConstants } from "./comments";

const CommentsPlugin = pluginSetup({
  services,
  reducers: commentsConstants.reducersArray,
  name: "comments",
});

export default CommentsPlugin;

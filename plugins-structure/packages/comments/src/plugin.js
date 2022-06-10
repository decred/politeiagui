import { Plugin } from "@politeiagui/core";
import { routes } from "./routes";
import { commentsConstants } from "./comments";

const CommentsPlugin = Plugin({
  routes,
  reducers: commentsConstants.reducersArray,
  name: "comments",
});

export default CommentsPlugin;

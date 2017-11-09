import get from "lodash/fp/get";
import { or, constant } from "../lib/fp";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

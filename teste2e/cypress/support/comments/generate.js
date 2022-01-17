import faker from "faker";
import { User } from "../users/generate";
export function Comment({
  user,
  commentid,
  token,
  parentid = 0,
  comment,
  publickey,
  signature,
  state = 2
} = {}) {
  if (!user) {
    user = new User();
  }
  this.commentid = commentid;
  this.comment = comment || faker.lorem.sentence();
  this.downvotes = 0;
  this.parentid = parentid;
  this.publickey =
    publickey || faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.receipt = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.signature =
    signature || faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.state = state;
  this.timestamp = new Date().getTime() / 1000;
  this.token = token;
  this.upvotes = 0;
  this.userid = user.userid;
  this.username = user.username;
}

export function Vote({ token, userid, user, maxCommentID }) {
  if (!user) {
    user = new User({ userid });
  }
  this.commentid =
    maxCommentID > 1 ? faker.datatype.number({ min: 1, max: maxCommentID }) : 1;
  this.publickey = faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.receipt = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.signature = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.state = 2;
  this.timestamp = new Date().getTime() / 1000;
  this.token = token;
  this.userid = userid;
  this.username = user.username;
  this.vote = 1;
}

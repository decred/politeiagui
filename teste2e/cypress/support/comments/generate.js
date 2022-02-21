import faker from "faker";
import { User } from "../users/generate";
export function Comment({
  user,
  userid,
  commentid,
  token,
  parentid = 0,
  comment,
  publickey,
  signature,
  state = 2,
  maxUpvote = 0,
  maxDownVote = 0,
  extradata,
  extradatahint,
  createdat
} = {}) {
  if (!user) {
    user = new User({ userid });
  }
  this.commentid = commentid;
  this.comment = comment || faker.lorem.sentence();
  this.downvotes = faker.datatype.number({ min: 0, max: maxDownVote });
  this.parentid = parentid;
  this.publickey =
    publickey || faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.receipt = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.signature =
    signature || faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.state = state;
  this.timestamp = new Date().getTime() / 1000;
  this.token = token;
  this.upvotes = faker.datatype.number({ min: 0, max: maxUpvote });
  this.userid = user.userid;
  this.username = user.username;
  this.createdat = createdat;
  this.extradata = extradata;
  this.extradatahint = extradatahint;
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

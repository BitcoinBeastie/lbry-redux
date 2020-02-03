declare type Comment = {
  comment: string, // comment body
  comment_id: string, // sha256 digest
  claim_id: string, // id linking to the claim this comment
  timestamp: number, // integer representing unix-time
  is_hidden: boolean, // claim owner may enable/disable this
  channel_id?: string,  // claimId of channel signing this comment
  channel_name?: string,  // name of channel claim
  channel_url?: string, // full lbry url to signing channel
  signature?: string, // signature of comment by originating channel
  signing_ts?: string, // timestamp used when signing this comment
  is_channel_signature_valid?: boolean, // whether or not the signature could be validated
  parent_id?: string, // if present, the comment is a reply
};

// todo: implement --is_mine for comment_list
// todo: rename byId to commentsByClaimId
declare type CommentsState = {
  commentsByUri: { [string]: string },
  repliesByCommentId: { [string]: Array<string> },
  byId: { [string]: Array<string> },
  commentById: { [string]: Comment },
  isLoading: boolean,
  myComments: ?Set<string>,
};

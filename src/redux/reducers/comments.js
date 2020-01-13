// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: CommentsState = {
  commentById: {}, // commentId -> Comment
  byId: {}, // ClaimID -> list of comments
  commentsByUri: {}, // URI -> claimId
  isLoading: false,
  myComments: undefined,
};

export const commentReducer = handleActions(
  {
    [ACTIONS.COMMENT_CREATE_STARTED]: (state: CommentsState, action: any): CommentsState => ({
      ...state,
      isLoading: true,
    }),

    [ACTIONS.COMMENT_CREATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),

    [ACTIONS.COMMENT_CREATE_COMPLETED]: (state: CommentsState, action: any): CommentsState => {
      const { comment, claimId }: { comment: Comment, claimId: string } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const comments = byId[claimId];
      const newCommentIds = comments.slice();

      // add the comment by its ID
      commentById[comment.comment_id] = comment;

      // push the comment_id to the top of ID list
      newCommentIds.unshift(comment.comment_id);
      byId[claimId] = newCommentIds;

      return {
        ...state,
        commentById,
        byId,
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_LIST_STARTED]: state => ({ ...state, isLoading: true }),

    [ACTIONS.COMMENT_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const { comments, claimId, uri } = action.data;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const commentsByUri = Object.assign({}, state.commentsByUri);

      if (comments) {
        // we use an Array to preserve order of listing
        // in reality this doesn't matter and we can just
        // sort comments by their timestamp
        const commentIds = Array(comments.length);

        // map the comment_ids to the new comments
        for (let i = 0; i < comments.length; i++) {
          commentIds[i] = comments[i].comment_id;
          commentById[commentIds[i]] = comments[i];
        }

        byId[claimId] = commentIds;
        commentsByUri[uri] = claimId;
      }
      return {
        ...state,
        byId,
        commentById,
        commentsByUri,
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
    [ACTIONS.COMMENT_ABANDON_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    // remove the existing comment from the id -> comment list and claim -> commentIds
    [ACTIONS.COMMENT_ABANDON_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment_id, abandoned } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);

      if (abandoned && comment_id in abandoned) {
        // messy but necessary for the time being
        const comment: Comment = commentById[comment_id];
        const commentIds = byId[comment.claim_id];
        byId[comment.claim_id] = commentIds.filter(commentId => commentId !== comment_id);

        Object.keys(commentById).forEach(commentId => {
          if (commentId === comment_id) {
            delete commentById[commentId];
          }
        });
      }
      return {
        ...state,
        commentById,
        byId,
        isLoading: false,
      };
    },
    // do nothing
    [ACTIONS.COMMENT_ABANDON_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
    // do nothing
    [ACTIONS.COMMENT_UPDATE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    // replace existing comment with comment returned here under its comment_id
    [ACTIONS.COMMENT_UPDATE_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment } = action.data;
      const commentById = Object.assign({}, state.commentById);

      if (comment) {
        commentById[comment.comment_id] = comment;
      }

      return {
        ...state,
        commentById,
        isLoading: false,
      };
    },
    // nothing can be done here
    [ACTIONS.COMMENT_UPDATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
    // nothing can really be done here
    [ACTIONS.COMMENT_HIDE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    [ACTIONS.COMMENT_HIDE_COMPLETED]: (state: CommentsState, action: any) => ({
      ...state, // todo: add HiddenComments state & create selectors
      isLoading: false,
    }),
    // nothing can be done here
    [ACTIONS.COMMENT_HIDE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
  },
  defaultState
);

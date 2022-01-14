const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
      required: [true, "Comment cannot be blank."],
      trim: true,
    },
    writtenBy: {
      type: String,
      required: [true, "Name is required."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: [true, "Name is required."],
    },
    commentBody: {
      type: String,
      required: [true, "Comment cannot be blank."],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    replies: [ReplySchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of comments replies on retrieval
CommentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;

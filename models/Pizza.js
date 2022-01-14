const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// create the pizza schema
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: [true, "Pizza Name is required."],
      trim: true,
    },
    createdBy: {
      type: String,
      required: [true, "Creator's Name is required."],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
      required: [true, "Pizza Size selection is required."],
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the pizza model
const Pizza = model("Pizza", PizzaSchema);

// export the pizza model
module.exports = Pizza;

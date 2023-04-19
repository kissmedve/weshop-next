const mongoose = require("mongoose");

const collectiveCartSchema = mongoose.Schema(
  {
    lineItems: [
      {
        productId: {
          type: String,
        },
        productName: {
          type: String,
        },
        priceAtDelivery: {
          type: Number,
        },
        quantityOrdered: {
          type: Number,
        },
        quantityDelivered: {
          type: Number,
        },
        quantityRemainder: {
          type: Number,
        },
        moneyRemainder: {
          type: Number,
        },
      },
    ],
    subtotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    deliveryDate: {
      type: Date,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    status: {
      // in progress: 0, closed: 1;
      //
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.CollectiveCart ||
  mongoose.model("CollectiveCart", collectiveCartSchema);

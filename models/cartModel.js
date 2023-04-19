const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    lineItems: [
      {
        productId: {
          type: String,
        },
        productName: {
          type: String,
        },
        priceAtOrder: {
          type: Number,
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
        lineItemPrice: {
          type: Number,
        },
        lineItemStatus: {
          type: String,
        },
      },
    ],
    userSubtotal: {
      type: Number,
    },
    userTotal: {
      type: Number,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: (true, "Please select a shop"),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: (true, "Please select a user"),
    },
    status: {
      // open: 0, ordered: 1, processed: 2
      // ----------------------------------
      // open = open for orders
      // ordered = closed, collective order sent to shop
      // processed = goods delivered, invoices processed
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

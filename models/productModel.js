const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    url: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    titleExt: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    basePrice: {
      type: String,
    },
    basePriceUnit: {
      type: String,
    },
    price: {
      // stored as integer, not float due to precision loss
      // 3500 (pennies) instead of 35.00
      type: Number,
    },
    currency: {
      type: String,
      default: "€",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    quantityInCart: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);

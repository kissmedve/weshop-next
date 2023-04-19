const mongoose = require("mongoose");

// Unique email differentiates users with email.
// Users without email or email access
// (possibly: seniors, people in rehab, youth, prisoners etc.)
// are differentiated by their lastName/firstName combo.
// Two John Doe's have to be named Doe, John 1, and Doe, John 2.

const userSchema = mongoose.Schema(
  {
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
      unique: (true, "This email address is already in use"),
    },
    password: {
      type: String,
      required: (true, "Please enter your password."),
    },
    role: {
      type: String,
      default: "Basic",
    },
    active: {
      type: Boolean,
      default: true,
    },
    carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

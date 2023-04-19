import { connectDB } from "../../../utils/db";
import User from "../../../models/userModel";

// User profile data may only be changed by admin,
// since the app caters to small to midsize groups always organized by an admin.
// Email (unique) serves to identify the user.
// User may change their password (in different process).

export default async (req, res) => {
  await connectDB();

  let user = await User.findById(req.query.uid);
  const userName = user.name;

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (req.method === "GET") {
    user = await User.findById(req.query.uid);
    res.status(200).json(user);
  } else if (req.method === "PUT") {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.query.uid },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        active: req.body.active,
        carts: req.body.carts,
      },
      { new: true }
    );
    res.status(200).json({
      message: `"${user.firstName} ${user.lastName}"'s profile has been changed.`,
      status: 200,
      data: updatedUser,
    });
  } else if (req.method === "DELETE") {
    await User.deleteOne({ _id: req.query.uid });
    res.status(200).json({
      status: 200,
      message: `Deleted ${user.email}`,
      data: req.query.uid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

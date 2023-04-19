import { connectDB } from "../../../utils/db";
import User from "../../../models/userModel";

export default async (req, res) => {
  await connectDB();
  if (req.method === "GET") {
    const users = await User.find(
      {},
      "_id lastName firstName email role active carts"
    );

    res.json(users);
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

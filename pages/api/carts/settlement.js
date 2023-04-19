import { connectDB } from "../../../utils/db";
// importing User and Shop models before Cart model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Shop from "../../../models/shopModel";
import User from "../../../models/userModel";
import Cart from "../../../models/cartModel";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    let carts = await Cart.find({
      shop: req.query.shop,
      status: { $lt: "2" },
    })
      .populate({ path: "shop", select: "name" })
      .populate({ path: "user", select: "name" })
      .lean()
      .catch((error) => {
        error;
      });
    res.status(200).json(carts);
  }
};

import { connectDB } from "../../../utils/db";
// importing Shop and User models before Cart model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Shop from "../../../models/shopModel";
import User from "../../../models/userModel";
import Cart from "../../../models/cartModel";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    let cart = await Cart.findById(req.query.cid)
      .populate({ path: "shop", select: "name" })
      .populate({ path: "user", select: "firstName lastName" })
      .lean();
    res.status(200).json(cart);
  } else if (req.method === "PUT") {
    const updatedCart = await Cart.findByIdAndUpdate(
      { _id: req.query.cid },
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: `Cart has been changed."`,
      status: 200,
      data: updatedCart,
    });
  } else if (req.method === "DELETE") {
    await Cart.deleteOne({ _id: req.query.cid });
    res.status(200).json({
      status: 200,
      message: `Deleted cart`,
      data: req.query.cid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

import { connectDB } from "../../../utils/db";
// importing User and Cart models before CollectiveCart model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import User from "../../../models/userModel";
import Cart from "../../../models/cartModel";
import CollectiveCart from "../../../models/collectiveCartModel";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    let collectiveCart = await CollectiveCart.findById(req.query.ccid)
      .populate({ path: "shop", select: "name" })
      .lean();
    res.status(200).json(collectiveCart);
  } else if (req.method === "PUT") {
    const updatedCollectiveCart = await CollectiveCart.findByIdAndUpdate(
      { _id: req.query.ccid },
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: `Collective Cart has been changed."`,
      status: 200,
      data: updatedCollectiveCart,
    });
  } else if (req.method === "DELETE") {
    await CollectiveCart.deleteOne({ _id: req.query.ccid });
    res.status(200).json({
      status: 200,
      message: `Deleted collective cart`,
      data: req.query.ccid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

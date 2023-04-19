import { connectDB } from "../../../utils/db";
import CollectiveCart from "../../../models/collectiveCartModel";

export default async (req, res) => {
  if (req.method === "POST") {
    // collectiveCart saved from settlement page
    // (all the totals, plus id's of related carts)
    await connectDB();

    const {
      lineItems,
      subtotal,
      total,
      shop,
      deliveryDate,
      users,
      carts,
      status,
    } = req.body;
    const newCollectiveCart = await CollectiveCart.create({
      lineItems,
      subtotal,
      total,
      shop,
      deliveryDate,
      users,
      carts,
      status,
    });
    res.status(200).json({
      //   message: `CollectiveCart has been created."`,
      status: 200,
      data: newCollectiveCart._id,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

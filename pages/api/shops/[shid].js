import { connectDB } from "../../../utils/db";
import Shop from "../../../models/shopModel";

export default async (req, res) => {
  await connectDB();

  const shop = await Shop.findById(req.query.shid);
  const shopName = shop.name;

  if (!shop) {
    res.status(400);
    throw new Error("Shop not found");
  }

  if (req.method === "GET") {
    res.status(200).json(shop);
  } else if (req.method === "PUT") {
    const updatedShop = await Shop.findByIdAndUpdate(
      { _id: req.query.shid },
      { name: req.body.name, machineName: req.body.machineName },
      { new: true }
    );
    res.status(200).json({
      message: `"${shopName}" has been changed."`,
      status: 200,
      data: updatedShop,
    });
  } else if (req.method === "DELETE") {
    await Shop.deleteOne({ _id: req.query.shid });
    res.status(200).json({
      status: 200,
      message: `Deleted ${shop.name}`,
      data: req.query.shid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

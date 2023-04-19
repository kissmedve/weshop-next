import { connectDB } from "../../../utils/db";
import Shop from "../../../models/shopModel";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const shops = await Shop.find();
    res.json(shops);
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

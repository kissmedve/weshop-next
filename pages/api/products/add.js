import { connectDB } from "../../../utils/db";
import Product from "../../../models/productModel";

export default async (req, res) => {
  if (req.method === "POST") {
    await connectDB();
    await Product.create({
      title: req.body.title,
      titleExt: req.body.titleExt,
      url: req.body.url,
      imgUrl: req.body.imgUrl,
      basePrice: req.body.basePrice,
      basePriceUnit: req.body.basePriceUnit,
      price: req.body.price,
      tag: req.body.tag,
      shop: req.body.shop,
      quantityInCart: req.body.quantityInCart,
    });
    res.json({
      status: 200,
      message: `Product "${req.body.title}" was created.`,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

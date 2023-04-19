import { connectDB } from "../../../utils/db";
// importing Tag and Shop models before Product model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Tag from "../../../models/tagModel";
import Shop from "../../../models/shopModel";
import Product from "../../../models/productModel";

export default async (req, res) => {
  await connectDB();

  let product = await Product.findById(req.query.pid);
  const productTitle = product.title;

  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  if (req.method === "GET") {
    product = await Product.findById(req.query.pid)
      .populate({ path: "tag", select: "name" })
      .populate({ path: "shop", select: "name" })
      .lean();
    res.status(200).json(product);
  } else if (req.method === "PUT") {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.query.pid },
      {
        title: req.body.title,
        titleExt: req.body.titleExt,
        url: req.body.url,
        imgUrl: req.body.imgUrl,
        tag: req.body.tag,
        shop: req.body.shop,
        basePrice: req.body.basePrice,
        basePriceUnit: req.body.basePriceUnit,
        price: req.body.price,
        currency: req.body.currency,
        quantityInCart: req.body.quantityInCart,
      },
      { new: true }
    );
    res.status(200).json({
      message: `"${productTitle}" has been changed."`,
      status: 200,
      data: updatedProduct,
    });
  } else if (req.method === "DELETE") {
    await Product.deleteOne({ _id: req.query.pid });
    res.status(200).json({
      status: 200,
      message: `Deleted ${product.title}`,
      data: req.query.pid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

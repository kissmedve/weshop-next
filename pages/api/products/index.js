import { connectDB } from "../../../utils/db";
// importing Tag and Shop models before Product model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Tag from "../../../models/tagModel";
import Shop from "../../../models/shopModel";
import Product from "../../../models/productModel";
import { filterParams } from "../../../utils/filterParams";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const { results, targetpage } = req.query;

    let resultsPerPage = results ? Number(results) : 24;
    let targetPage = targetpage ? Number(targetpage) : 1;
    let numOfResults = 0;
    let numOfPages = 1;

    const filters = filterParams(req.query);

    await Product.countDocuments(filters)
      .lean()
      .then((count) => {
        numOfResults = count;
        numOfPages = Math.ceil(numOfResults / resultsPerPage);
      })
      .catch((error) => {
        error;
      });

    let products = await Product.find(filters)
      .populate({
        path: "tag",
        select: "name",
      })
      .populate({
        path: "shop",
        select: "name",
      })
      .skip(resultsPerPage * targetPage - resultsPerPage)
      .limit(resultsPerPage)
      .lean();
    res.status(200).json([products, targetPage, numOfPages]);
  } else if (req.method === "POST") {
    let products = req.body;

    const processProducts = async () => {
      let existingProducts = [];
      let newProducts = [];

      await Promise.all(
        products.forEach(async (product) => {
          console.log("product._id", product._id);
          if (product._id && product._id.length > 0) {
            console.log("product has _id with more than 0 digits");
            let productExists = await Product.find({ _id: product._id });
            if (!productExists) {
              console.log("product has _id, but is not known in the db");
              // product._id from former download, re-uploaded.
              // TODO: overwrite with new _id?
              let newProduct = await Product.create({
                _id: product._id,
                url: product.url,
                title: product.title,
                titleExt: product.titleExt,
                imgUrl: product.imgUrl,
                basePrice: product.basePrice,
                basePriceUnit: product.basePriceUnit,
                price: product.price,
                currency: product.currency,
                shop: product.shop,
                tag: product.tag,
                quantityInCart: 0,
              }).then(newProducts.push(product.title));
            } else {
              console.log("product is already in the db");
              existingProducts.push(product.title);
            }
          } else {
            console.log("product has no valid _id and will be created anew");
            console.log("create product", product);
            await Product.create({
              url: product.url,
              title: product.title,
              titleExt: product.titleExt,
              imgUrl: product.imgUrl,
              basePrice: product.basePrice,
              basePriceUnit: product.basePriceUnit,
              price: product.price,
              currency: product.currency,
              shop: product.shop,
              tag: product.tag,
              quantityInCart: 0,
            }).then(newProducts.push(product.title));
          }
        })
      ).catch((error) => console.log(error));
      await res.json({
        created: newProducts,
        existing: existingProducts,
      });
    };
    products && processProducts();
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

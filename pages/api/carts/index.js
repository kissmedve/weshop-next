import { connectDB } from "../../../utils/db";
// importing User and Shop models before Cart model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Shop from "../../../models/shopModel";
import User from "../../../models/userModel";
import Cart from "../../../models/cartModel";
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

    await Cart.countDocuments(filters)
      .lean()
      .then((count) => {
        numOfResults = count;
        numOfPages = Math.ceil(numOfResults / resultsPerPage);
      })
      .catch((error) => {
        error;
      });

    let carts = await Cart.find(filters)
      .populate({
        path: "user",
        select: "lastName firstName",
      })
      .populate({
        path: "shop",
        select: "name",
      })
      .skip(resultsPerPage * targetPage - resultsPerPage)
      .limit(resultsPerPage)
      .lean();

    res.status(200).json([carts, targetPage, numOfPages]);
  } else if (req.method === "POST") {
    // new carts being saved initially

    let carts = req.body;

    await Cart.insertMany(carts);
    res.json({
      status: 200,
      message: `${carts.length} carts created`,
      data: carts,
    });
  } else if (req.method === "PUT") {
    // carts of status: 0, being resaved due to changed amount of products or added/removed products
    let carts = req.body;

    await carts.map(async (cart) => {
      await Cart.findOneAndUpdate(
        {
          _id: cart._id,
        },
        cart,
        {
          new: true,
        }
      );
    });
    res.json({
      status: 200,
      message: `${carts.length} carts updated`,
      data: carts,
    });
  }
};

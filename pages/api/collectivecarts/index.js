import { connectDB } from "../../../utils/db";
// importing User and Shop models before Cart model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import Shop from "../../../models/shopModel";
import User from "../../../models/userModel";
import Cart from "../../../models/cartModel";
import CollectiveCart from "../../../models/collectiveCartModel";
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

    await CollectiveCart.countDocuments(filters)
      .lean()
      .then((count) => {
        numOfResults = count;
        numOfPages = Math.ceil(numOfResults / resultsPerPage);
      })
      .catch((error) => {
        error;
      });

    let collectiveCarts = await CollectiveCart.find(filters)
      .populate({
        path: "users",
        select: "name",
      })
      .populate({
        path: "shop",
        select: "name",
      })
      .skip(resultsPerPage * targetPage - resultsPerPage)
      .limit(resultsPerPage)
      .lean();

    res.status(200).json([collectiveCarts, targetPage, numOfPages]);
  } else if (req.method === "POST") {
    let collectiveCart = req.body;

    await CollectiveCart.create(collectiveCart);
    res.json({
      status: 200,
      message: "Collective cart created",
      data: collectiveCart,
    });
  }
};

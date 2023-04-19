import { connectDB } from "../../../utils/db";
import Shop from "../../../models/shopModel";

export default async (req, res) => {
  if (req.method === "POST") {
    await connectDB();
    await Shop.create({
      name: req.body.name,
      machineName: req.body.machineName,
    });
    res.json({
      status: 200,
      message: `Shop "${req.body.name}" was created.`,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

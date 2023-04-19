import { connectDB } from "../../../utils/db";
import TagGroup from "../../../models/tagGroupModel";

export default async (req, res) => {
  if (req.method === "POST") {
    await connectDB();
    await TagGroup.create({
      name: req.body.name,
      machineName: req.body.machineName,
    });
    res.json({
      status: 200,
      message: `Tag group "${req.body.name}" was created.`,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

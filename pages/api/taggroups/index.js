import { connectDB } from "../../../utils/db";
import TagGroup from "../../../models/tagGroupModel";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const tagGroups = await TagGroup.find();
    res.json(tagGroups);
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

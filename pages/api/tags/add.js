import { connectDB } from "../../../utils/db";
import Tag from "../../../models/tagModel";

export default async (req, res) => {
  if (req.method === "POST") {
    await connectDB();
    const incomingTag = req.body;

    const existingTag = await Tag.findOne({
      machineName: req.body.machineName,
    });
    if (!existingTag) {
      await Tag.create({
        name: req.body.name,
        machineName: req.body.machineName,
        tagGroup: req.body.tagGroup || null,
      });
      res.json({
        status: 200,
        message: `Tag "${req.body.name}" was created.`,
      });
    } else {
      res.json({
        status: 401,
        message: `"${req.body.machineName}" is already in the database. "${req.body.name}" could not be created.`,
      });
    }
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

import { connectDB } from "../../../utils/db";
import Tag from "../../../models/tagModel";

export default async (req, res) => {
  await connectDB();

  let tag = await Tag.findById(req.query.tid);
  const tagName = tag.name;

  if (!tag) {
    res.status(400);
    throw new Error("Tag not found");
  }

  if (req.method === "GET") {
    tag = await Tag.findById(req.query.tid)
      .populate({ path: "tagGroup", select: "name" })
      .lean();
    res.status(200).json(tag);
  } else if (req.method === "PUT") {
    const updatedTag = await Tag.findByIdAndUpdate(
      { _id: req.query.tid },
      {
        name: req.body.name,
        machineName: req.body.machineName,
        tagGroup: req.body.tagGroup,
      },
      { new: true }
    );
    res.status(200).json({
      message: `"${tagName}" has been changed."`,
      status: 200,
      data: updatedTag,
    });
  } else if (req.method === "DELETE") {
    await Tag.deleteOne({ _id: req.query.tid });
    res.status(200).json({
      status: 200,
      message: `Deleted ${tag.name}`,
      data: req.query.tid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

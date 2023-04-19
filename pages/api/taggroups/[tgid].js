import { connectDB } from "../../../utils/db";
import TagGroup from "../../../models/tagGroupModel";

export default async (req, res) => {
  await connectDB();

  const tagGroup = await TagGroup.findById(req.query.tgid);
  const tagGroupName = tagGroup.name;

  if (!tagGroup) {
    res.status(400);
    throw new Error("TagGroup not found");
  }

  if (req.method === "GET") {
    res.status(200).json(tagGroup);
  } else if (req.method === "PUT") {
    const updatedTagGroup = await TagGroup.findByIdAndUpdate(
      { _id: req.query.tgid },
      { name: req.body.name, machineName: req.body.machineName },
      { new: true }
    );
    res.status(200).json({
      message: `"${tagGroupName}" has been changed."`,
      status: 200,
      data: updatedTagGroup,
    });
  } else if (req.method === "DELETE") {
    await TagGroup.deleteOne({ _id: req.query.tgid });
    res.status(200).json({
      status: 200,
      message: `Deleted ${tagGroup.name}`,
      data: req.query.tgid,
    });
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

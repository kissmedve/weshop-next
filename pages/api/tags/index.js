import { connectDB } from "../../../utils/db";
// importing TagGroup model before Tag model to  prevent
// 'Schema hasn't been registered for model "XYZ"' error
import TagGroup from "../../../models/tagGroupModel";
import Tag from "../../../models/tagModel";
import { createMachineName } from "../../../utils/createMachineName";

export default async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const tags = await Tag.find()
      .populate({ path: "tagGroup", select: "name" })
      .lean();
    res.json(tags);
  } else if (req.method === "POST") {
    let tagz = req.body;
    let tags = tagz.map((tag) => ({
      ...tag,
      machineName:
        !tag.machineName || tag.machineName === ""
          ? createMachineName(tag.name)
          : tag.machineName,
    }));
    const processTags = async () => {
      let existingTags = [];
      let newTags = [];
      try {
        await Promise.all(
          tags.forEach(async (tag) => {
            if (tag._id && tag.machineName) {
              let idAndMachineNameFound = await Tag.findOneAndUpdate(
                {
                  _id: tag._id,
                  machineName: tag.machineName,
                },
                {
                  name: tag.name && tag.name,
                  tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
                },
                {
                  new: true,
                }
              );

              idAndMachineNameFound &&
                existingTags.push(idAndMachineNameFound.name);

              if (!idAndMachineNameFound) {
                let createdNew = await Tag.create({
                  name: tag.name && tag.name,
                  machineName: tag.machineName && tag.machineName,
                  name: tag.name && tag.name,
                  tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
                });

                newTags.push(createdNew.name);
              }

              return;
            }
            if (tag._id) {
              let idFound = await Tag.findOneAndUpdate(
                {
                  _id: tag._id,
                },
                {
                  machineName: tag.machineName,
                  name: tag.name && tag.name,
                  tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
                },
                {
                  new: true,
                }
              );
              idFound && existingTags.push(idFound.name);

              return;
            }
            if (tag.machineName) {
              let machineNameFound = await Tag.findOneAndUpdate(
                {
                  machineName: tag.machineName,
                },
                {
                  name: tag.name && tag.name,
                  tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
                },
                {
                  new: true,
                }
              );
              machineNameFound && existingTags.push(machineNameFound.name);

              if (!machineNameFound) {
                let noMachineNameFound = await Tag.create({
                  machineName: tag.machineName,
                  name: tag.name && tag.name,
                  tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
                });
                noMachineNameFound && newTags.push(noMachineNameFound.name);
              }

              return;
            }
            if (!tag._id && !tag.machineName) {
              let noIdNoMachineName = await Tag.create({
                machineName: tag.machineName,
                name: tag.name && tag.name,
                tagGroup: tag.tagGroupId ? tag.tagGroupId : null,
              });
              noIdNoMachineName && newTags.push(noIdNoMachineName.name);

              return;
            }
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    tags && processTags();
    res.json("some response");
  } else {
    throw new Error("http method not supported on this endpoint");
  }
};

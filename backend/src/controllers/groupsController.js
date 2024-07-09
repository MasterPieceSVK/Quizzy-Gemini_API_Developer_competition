const { Group } = require("../models/group");
const { generateInviteCode } = require("../utils/generateInviteCode");

async function createGroup(req, res) {
  try {
    const { name } = req.body;
    const teacher_id = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    let inviteCode;
    let isUnique = false;

    // Loop to ensure the invite code is unique
    while (!isUnique) {
      inviteCode = generateInviteCode();
      const existingGroup = await Group.findOne({
        where: { invite_code: inviteCode },
      });
      if (!existingGroup) {
        isUnique = true;
      }
    }

    const newGroup = await Group.create({
      teacher_id,
      name,
      invite_code: inviteCode,
    });

    res.json(newGroup);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while creating group" });
  }
}

module.exports = { createGroup };

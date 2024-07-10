const { Sequelize } = require("sequelize");
const { Group } = require("../models/group");
const { generateInviteCode } = require("../utils/generateInviteCode");
const { GroupStudents } = require("../models/groupStudent");

async function createGroup(req, res) {
  try {
    const { name } = req.body;
    const teacher_id = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    let inviteCode;
    let isUnique = false;

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

async function getGroups(req, res) {
  try {
    const user_id = req.user.id;
    const groups = await Group.findAll({ where: { teacher_id: user_id } });

    const groupsWithStudentCount = await Promise.all(
      groups.map(async (group) => {
        const studentCount = await GroupStudents.count({
          where: { group_id: group.id },
        });
        return {
          ...group.toJSON(),
          studentCount,
        };
      })
    );

    res.json(groupsWithStudentCount);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while getting groups" });
  }
}

module.exports = { createGroup, getGroups };

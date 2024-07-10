const { Sequelize } = require("sequelize");
const { Group } = require("../models/group");
const { generateInviteCode } = require("../utils/generateInviteCode");
const { GroupStudents } = require("../models/groupStudent");
const { User } = require("../models/user");
const { Result } = require("../models/result");

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
    const groups = await Group.findAll({
      where: { teacher_id: user_id },
      order: [["updatedAt", "DESC"]],
    });

    const groupsWithStudents = await Promise.all(
      groups.map(async (group) => {
        const groupStudents = await GroupStudents.findAll({
          where: { group_id: group.id },
          attributes: ["user_id"],
          order: [["updatedAt", "DESC"]],
        });

        const students = await Promise.all(
          groupStudents.map(async (groupStudent) => {
            const student = await User.findOne({
              where: { id: groupStudent.user_id },
              attributes: ["id", "username", "email"],
            });
            return student;
          })
        );
        const studentCount = students.length || 0;

        return {
          ...group.toJSON(),
          students,
          studentCount,
        };
      })
    );

    res.json(groupsWithStudents);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while getting groups" });
  }
}

async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    console.log(id);
    console.log(group);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.teacher_id != req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this group" });
    }

    await group.destroy();
    res.json({ message: "Group deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while deleting group" });
  }
}

async function getGroupsOffline(req, res, next) {
  try {
    const user_id = req.user.id;
    const groups = await Group.findAll({
      where: { teacher_id: user_id },
      order: [["updatedAt", "DESC"]],
    });

    const groupsWithStudents = await Promise.all(
      groups.map(async (group) => {
        const groupStudents = await GroupStudents.findAll({
          where: { group_id: group.id },
          attributes: ["user_id"],
          order: [["updatedAt", "DESC"]],
        });

        const students = await Promise.all(
          groupStudents.map(async (groupStudent) => {
            const student = await User.findOne({
              where: { id: groupStudent.user_id },
              attributes: ["id", "username", "email"],
            });
            return student;
          })
        );
        const studentCount = students.length || 0;

        return {
          ...group.toJSON(),
          students,
          studentCount,
        };
      })
    );

    req.groups = groupsWithStudents;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while getting groups" });
  }
}

async function getUnassignedGroups(req, res) {
  try {
    const { groups } = req;
    const { exam_id } = req.params;
    const unassignedGroups = await Promise.all(
      groups.map(async (group) => {
        const dbGroup = await Result.findOne({
          where: { group_id: group.id, exam_id: exam_id },
        });

        if (!dbGroup) {
          return group;
        }
      })
    );

    const filteredGroups = unassignedGroups.filter(Boolean);

    res.json(filteredGroups);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "Error while getting unassigned groups" });
  }
}

module.exports = {
  createGroup,
  getGroups,
  getUnassignedGroups,
  getGroupsOffline,
  deleteGroup,
};

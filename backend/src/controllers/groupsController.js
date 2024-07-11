const { Sequelize } = require("sequelize");
const { Group } = require("../models/group");
const { generateInviteCode } = require("../utils/generateInviteCode");
const { GroupStudents } = require("../models/groupStudent");
const { User } = require("../models/user");
const { Result } = require("../models/result");
const { Exam } = require("../models/exam");

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

async function getAssignedExams(req, res) {
  try {
    const { groups } = req;

    // Step 1: Fetch exams for all groups in one query
    const groupIds = groups.map((group) => group.id);
    const dbExams = await Result.findAll({
      where: {
        group_id: groupIds,
      },
      order: [["updatedAt", "DESC"]],
    });

    // Step 2: Group exams by exam_id and then by group_id
    const groupedExams = dbExams.reduce((acc, exam) => {
      const examKey = exam.exam_id;
      const groupKey = exam.group_id;

      if (!acc[examKey]) {
        acc[examKey] = {};
      }
      if (!acc[examKey][groupKey]) {
        acc[examKey][groupKey] = [];
      }

      acc[examKey][groupKey].push(exam);
      return acc;
    }, {});

    // Step 3: Convert grouped exams to the desired nested array format
    const sortedResult = Object.keys(groupedExams)
      .sort((a, b) => a - b) // Sort by exam_id
      .map((examKey) => {
        const groups = groupedExams[examKey];
        const sortedGroups = Object.keys(groups)
          .sort((a, b) => a - b) // Sort by group_id
          .map((groupKey) => groups[groupKey]);

        return sortedGroups;
      });

    // Step 4: Fetch additional data for all groups, exams, and users in one go
    const groupIdsUnique = [...new Set(dbExams.map((exam) => exam.group_id))];
    const examIdsUnique = [...new Set(dbExams.map((exam) => exam.exam_id))];
    const userIdsUnique = [...new Set(dbExams.map((exam) => exam.user_id))];

    const [dbGroups, dbExamsDetails, dbUsers] = await Promise.all([
      Group.findAll({ where: { id: groupIdsUnique } }),
      Exam.findAll({ where: { id: examIdsUnique } }),
      User.findAll({ where: { id: userIdsUnique } }),
    ]);

    const groupMap = dbGroups.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    }, {});

    const examMap = dbExamsDetails.reduce((acc, exam) => {
      acc[exam.id] = exam;
      return acc;
    }, {});

    const userMap = dbUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Step 5: Build the response
    const response = sortedResult.map((examGroups) =>
      examGroups.map((groupArray) =>
        groupArray.map((exam) => {
          const groupData = groupMap[exam.group_id];
          const examData = examMap[exam.exam_id];
          const userData = userMap[exam.user_id];

          return {
            ...exam.dataValues,
            group_name: groupData.name,
            exam_name: examData.title,
            username: userData.username,
            email: userData.email,
          };
        })
      )
    );

    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Couldn't get assigned exams" });
  }
}

module.exports = {
  createGroup,
  getGroups,
  getUnassignedGroups,
  getGroupsOffline,
  deleteGroup,
  getAssignedExams,
};

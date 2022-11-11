/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 * @typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */

 const { DateTimeResolver } = require('graphql-scalars')
 

const resolvers = {
  Query: {
    allUsers: async (parent, args, { prisma }) => {return prisma.user.findMany() },
    allGroups: async (parent, args, { prisma }) => {return prisma.group.findMany() },
    allMessages: async (parent, args, { prisma }) => {return prisma.message.findMany() },
    allSubjects: async (parent, args, { prisma }) => {return prisma.subject.findMany() },
    allSchedules: async (parent, args, { prisma }) => {return prisma.schedule.findMany() },
    allGrades: async (parent, args, { prisma }) => {return prisma.grade.findMany() },
    allRooms: async (parent, args, { prisma }) => {return prisma.room.findMany() },
    allTeachers: async (parent, args, { prisma }) => {return prisma.user.findMany({where: {isTeacher: true}}) },
    allStudents: async (parent, args, { prisma }) => {return prisma.user.findMany({where: {isTeacher: false}}) },
    SchedulesByGroup: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {group: {id: args.groupId}}}) },
    SchedulesByTeacher: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {teacher: {id: args.teacherId}}}) },
    SchedulesBySubject: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {subject: {id: args.subjectId}}}) },
    SchedulesByRoom: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {room: {id: args.roomId}}}) },
  },

    Mutation: {
        createGroup: async (parent, args, { prisma }) => {
            return prisma.group.create({
                data: args
            })
        },
        createMessage: async (parent, args, { prisma }) => {
            return prisma.message.create({
                data: {
                    text: args.input.text,
                    Sender: {connect: {id: parseInt(args.input.sender_id)}},
                    Receiver: {connect: {id: parseInt(args.input.receiver_id)}},
                }
            })
        },
        createSubject: async (parent, args, { prisma }) => {
            return prisma.subject.create({
                data: {
                    name: args.input.name,
                    Teacher: {connect: {id: parseInt(args.input.teacher_id)}},
                }
            })
        },
        addGroupSchedule: async (parent, args, { prisma }) => {
            return prisma.schedule.create({
                data: {
                    day: args.input.day,
                    time: args.input.time,
                    Group: {connect: {id: parseInt(args.input.group_id)}},
                    Subject: {connect: {id: parseInt(args.input.subject_id)}},
                    Room: {connect: {id: parseInt(args.input.room_id)}},
                }
            })
        },
        createRoom: async (parent, args, { prisma }) => {
            return prisma.room.create({
                data: args.input
            })
        },
        
    },  
    User: {
        Group: async (parent, args, { prisma }) => {
            return prisma.user.findUnique({ where: { id: parent.id } }).Group()
        },
        Sent: async (parent, args, { prisma }) => {
            return prisma.user.findMany({ where: { id: parent.id } }).Sent()
        },
        Received: async (parent, args, { prisma }) => {
            return prisma.user.findMany({ where: { id: parent.id } }).Received()
        },
        Grades: async (parent, args, { prisma }) => {
            return prisma.user.findMany({ where: { id: parent.id } }).Grades()
        },
        Subjects: async (parent, args, { prisma }) => {
            return prisma.user.findMany({ where: { id: parent.id } }).Subjects()
        },
    },
    Message: {
        Sender: async (parent, args, { prisma }) => {
            return prisma.message.findUnique({ where: { id: parent.id } }).Sender()
        },
        Receiver: async (parent, args, { prisma }) => {
            return prisma.message.findUnique({ where: { id: parent.id } }).Receiver()
        },
    },
    Group: {
        Schedule: async (parent, args, { prisma }) => {
            return prisma.group.findMany({ where: { id: parent.id } }).Schedule()
        },
        Students: async (parent, args, { prisma }) => {
            return prisma.group.findMany({ where: { id: parent.id } }).Students()
        }
    },
};
module.exports = {
    resolvers
  }
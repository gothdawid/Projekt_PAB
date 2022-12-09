/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 * @typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const { DateTimeResolver } = require('graphql-scalars')
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET;

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
    SchedulesByGroup: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {group_id: parseInt(args.group_id)}}) },
    SchedulesByTeacher: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {teacher_id: parseInt(args.teacher_id)}}) },
    SchedulesBySubject: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {subject_id: parseInt(args.teacher_id)}}) },
    SchedulesByRoom: async (parent, args, { prisma }) => {return prisma.schedule.findMany({where: {room_id: parseInt(args.teacher_id)}}) },
  },

    Mutation: {
        login: async (parent, { input: { id, password } }, { prisma }) => {
            const user = await prisma.user.findUnique({ where: { id } });
      
            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
              throw new Error('Nieprawidłowe ID lub hasło' + hashedPassword);
            }
            
            const passwordMatch = await bcrypt.compare(password, user.password);
      
            if (!passwordMatch) {
              throw new Error('Nieprawidłowe ID lub hasło');
            }
      
            const token = jwt.sign({ userId: user.id, name: user.first_name, last_name: user.last_name}, secret);
      
            return {
              token,
              user,
            };
        },
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
            return prisma.user.findUnique({ where: { id: parent.id } }).Sent()
        },
        Received: async (parent, args, { prisma }) => {
            return prisma.user.findUnique({ where: { id: parent.id } }).Received()
        },
        Grades: async (parent, args, { prisma }) => {
            return prisma.user.findUnique({ where: { id: parent.id } }).Grades()
        },
        Subjects: async (parent, args, { prisma }) => {
            return prisma.user.findUnique({ where: { id: parent.id } }).Subjects()
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
            return prisma.group.findUnique({ where: { id: parent.id } }).Schedule()
        },
        Students: async (parent, args, { prisma }) => {
            return prisma.group.findUnique({ where: { id: parent.id } }).Students()
        },
    },
    Schedule: {
        Group: async (parent, args, { prisma }) => {
            return prisma.schedule.findUnique({ where: { id: parent.id } }).Group()
        },
        Subject: async (parent, args, { prisma }) => {
            return prisma.schedule.findUnique({ where: { id: parent.id } }).Subject()
        },
        Room: async (parent, args, { prisma }) => {
            return prisma.schedule.findUnique({ where: { id: parent.id } }).Room()
        },
    },
    Subject: {
        Schedule: async (parent, args, { prisma }) => {
            return prisma.subject.findUnique({ where: { id: parent.id } }).Schedule()
        },
        Teacher: async (parent, args, { prisma }) => {
            return prisma.subject.findUnique({ where: { id: parent.id } }).Teacher()
        },

    },
    Grade: {
        Student: async (parent, args, { prisma }) => {
            return prisma.grade.findUnique({ where: { id: parent.id } }).Student()
        },
        Subject: async (parent, args, { prisma }) => {
            return prisma.grade.findUnique({ where: { id: parent.id } }).Subject()
        },
    },
    Room: {
        Schedule: async (parent, args, { prisma }) => {
            return prisma.room.findUnique({ where: { id: parent.id } }).Schedule()
        },
    },
    
};
module.exports = {
    resolvers
  }
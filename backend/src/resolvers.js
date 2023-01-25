/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 * @typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { DateTimeResolver } = require("graphql-scalars");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.SECRET;

// function for verify token
async function verifyToken(prisma, headers) {
  const token = headers.authorization || "";
  if (!token) {
    throw new Error("Błąd autoryzacji!");
  }
  let decodedToken = null;
  try {
    decodedToken = jwt.verify(token, secret, {
      issuer: "MyApp",
      audience: "https://myapp.com",
      subject: "user",
      jwtid: "12345",
    });
    // jeśli token jest prawidłowy, to zostanie zwrócony obiekt z danymi użytkownika
  } catch (error) {
    // jeśli token jest przedawniony, to zostanie zwrócony wyjątek TokenExpiredError
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token jest przedawniony");
    } else {
      console.log(error);
      throw new Error("Token jest nieprawidłowy");
    }
  }

  if (!decodedToken || !decodedToken.userId) {
    throw new Error("Błędny token!");
  }
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.userId },
  });
  if (!user) {
    throw new Error("Błąd autoryzacji!");
  }
  if (user.access_level < 1) {
    throw new Error("Brak uprawnień!");
  }
  return user;
}

const resolvers = {
  Query: {
    allUsers: async (parent, args, { prisma, headers, user }) => {
      console.log(headers);
      try {
        await verifyToken(prisma, headers);
      } catch (error) {
        throw new Error(error, error.message, error.stack, error.name);
      }

      return prisma.user.findMany();
    },
    allGroups: async (parent, args, { prisma }) => {
      return prisma.group.findMany();
    },
    allMessages: async (parent, args, { prisma }) => {
      return prisma.message.findMany();
    },
    allSubjects: async (parent, args, { prisma }) => {
      return prisma.subject.findMany();
    },
    allSchedules: async (parent, args, { prisma }) => {
      return prisma.schedule.findMany();
    },
    allGrades: async (parent, args, { prisma }) => {
      return prisma.grade.findMany();
    },
    allRooms: async (parent, args, { prisma }) => {
      return prisma.room.findMany();
    },
    allTeachers: async (parent, args, { prisma }) => {
      return prisma.user.findMany({ where: { isTeacher: true } });
    },
    allStudents: async (parent, args, { prisma }) => {
      return prisma.user.findMany({ where: { isTeacher: false } });
    },
    SchedulesByGroup: async (parent, args, { prisma }) => {
      return prisma.schedule.findMany({
        where: { group_id: parseInt(args.group_id) },
      });
    },
    SchedulesByTeacher: async (parent, args, { prisma }) => {
      return prisma.schedule.findMany({
        where: { teacher_id: parseInt(args.teacher_id) },
      });
    },
    SchedulesBySubject: async (parent, args, { prisma }) => {
      return prisma.schedule.findMany({
        where: { subject_id: parseInt(args.teacher_id) },
      });
    },
    SchedulesByRoom: async (parent, args, { prisma }) => {
      return prisma.schedule.findMany({
        where: { room_id: parseInt(args.teacher_id) },
      });
    },
    MyGrades: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      console.log(user);
      return prisma.grade.findMany({ where: { student_id: user.id } });
    },
    getMySentMessages: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      return prisma.message.findMany({ where: { sender_id: user.id } });
    },
    getMyReceivedMessages: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      return prisma.message.findMany({ where: { receiver_id: user.id } });
    },
    getAllMyMessages: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      return prisma.message.findMany({
        where: {
          OR: [{ sender_id: user.id }, { receiver_id: user.id }],
        },
      });
    },
    getMyAccount: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },

  Mutation: {
    login: async (parent, { input: { id, password } }, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new Error("Nieprawidłowe ID lub hasło");
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        throw new Error("Nieprawidłowe ID lub hasło");
      }

      const token = jwt.sign(
        // pierwszy parametr to obiekt z danymi użytkownika, które mają zostać zapisane w tokenie
        { userId: user.id, name: user.first_name, last_name: user.last_name },
        // drugi parametr to unikalny klucz secret, który jest używany do szyfrowania tokenu
        secret,
        // trzeci parametr to obiekt z dodatkowymi opcjami, które mają zostać ustawione w tokenie
        {
          issuer: "MyApp",
          audience: "https://myapp.com",
          subject: "user",
          jwtid: "12345",
          algorithm: "HS512",
          expiresIn: "10m",
        }
      );

      return {
        token,
        user,
      };
    },
    createGroup: async (parent, args, { prisma }) => {
      return prisma.group.create({
        data: args,
      });
    },
    createSubject: async (parent, args, { prisma }) => {
      return prisma.subject.create({
        data: {
          name: args.input.name,
          Teacher: { connect: { id: parseInt(args.input.teacher_id) } },
        },
      });
    },
    addGroupSchedule: async (parent, args, { prisma }) => {
      return prisma.schedule.create({
        data: {
          day: args.input.day,
          time: args.input.time,
          Group: { connect: { id: parseInt(args.input.group_id) } },
          Subject: { connect: { id: parseInt(args.input.subject_id) } },
          Room: { connect: { id: parseInt(args.input.room_id) } },
        },
      });
    },
    createRoom: async (parent, args, { prisma }) => {
      return prisma.room.create({
        data: args.input,
      });
    },
    sendMessage: async (
      parent,
      { input: { text, receiver_id } },
      { prisma, headers }
    ) => {
      const user = await verifyToken(prisma, headers);
      return prisma.message.create({
        data: {
          text,
          sender_id: user.id,
          receiver_id: parseInt(receiver_id),
        },
      });
    },
    deleteMessage: async (parent, args, { prisma, headers }) => {
      const user = await verifyToken(prisma, headers);
      // check if user is the sender or receiver
      try {
        const message = await prisma.message.findUnique({
          where: { id: parseInt(args.id) },
        });
        // if message is not found
        if (!message) {
          return false;
        }
        if (message.sender_id !== user.id && message.receiver_id !== user.id) {
          return false;
        }
        let a = await prisma.message.delete({
          where: { id: parseInt(args.id) },
        });
        if (a) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    updateMyAccount: async (
      parent,
      { input: { city, address, avatar } },
      { prisma, headers }
    ) => {
      const user = await verifyToken(prisma, headers);
      // args can be null
      if (city) {
        await prisma.user.update({
          where: { id: user.id },
          data: { city },
        });
      }
      if (address) {
        await prisma.user.update({
          where: { id: user.id },
          data: { address },
        });
      }
      if (avatar) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar },
        });
      }
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },
  User: {
    Group: async (parent, args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).Group();
    },
    Sent: async (parent, args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).Sent();
    },
    Received: async (parent, args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).Received();
    },
    Grades: async (parent, args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).Grades();
    },
    Subjects: async (parent, args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.id } }).Subjects();
    },
  },
  Message: {
    Sender: async (parent, args, { prisma }) => {
      return prisma.message.findUnique({ where: { id: parent.id } }).Sender();
    },
    Receiver: async (parent, args, { prisma }) => {
      return prisma.message.findUnique({ where: { id: parent.id } }).Receiver();
    },
  },
  Group: {
    Schedule: async (parent, args, { prisma }) => {
      return prisma.group.findUnique({ where: { id: parent.id } }).Schedule();
    },
    Students: async (parent, args, { prisma }) => {
      return prisma.group.findUnique({ where: { id: parent.id } }).Students();
    },
  },
  Schedule: {
    Group: async (parent, args, { prisma }) => {
      return prisma.schedule.findUnique({ where: { id: parent.id } }).Group();
    },
    Subject: async (parent, args, { prisma }) => {
      return prisma.schedule.findUnique({ where: { id: parent.id } }).Subject();
    },
    Room: async (parent, args, { prisma }) => {
      return prisma.schedule.findUnique({ where: { id: parent.id } }).Room();
    },
  },
  Subject: {
    Schedule: async (parent, args, { prisma }) => {
      return prisma.subject.findUnique({ where: { id: parent.id } }).Schedule();
    },
    Teacher: async (parent, args, { prisma }) => {
      return prisma.subject.findUnique({ where: { id: parent.id } }).Teacher();
    },
  },
  Grade: {
    Student: async (parent, args, { prisma }) => {
      return prisma.grade.findUnique({ where: { id: parent.id } }).Student();
    },
    Subject: async (parent, args, { prisma }) => {
      return prisma.grade.findUnique({ where: { id: parent.id } }).Subject();
    },
  },
  Room: {
    Schedule: async (parent, args, { prisma }) => {
      return prisma.room.findUnique({ where: { id: parent.id } }).Schedule();
    },
  },
};
module.exports = {
  resolvers,
};

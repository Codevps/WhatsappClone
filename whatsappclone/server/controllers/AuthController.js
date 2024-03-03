import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { name, email, image: profilePicture, about } = req.body;
    if (!name || !email || !profilePicture || !about) {
      return res.json({ msg: "All fields are required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.json({ msg: "User already exists", status: false });
    } else {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          profilePicture,
          about,
        },
      });
      return res.json({ msg: "User created", status: true, data: newUser });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        profilePicture: true,
        about: true,
        name: true,
      },
    });
    const usersGroupByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user?.name?.charAt(0).toUpperCase();
      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });
    // return res.status(200).json({ msg: "Users fetched", status: true, data: users });
    return res.status(200).send({ users: usersGroupByInitialLetter });
  } catch (error) {
    next(error);
  }
};

export const generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = parseInt(process.env.ZEGO_SERVER_ID);
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";
    if (appId && serverSecret && userId) {
      const token = await generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      res.status(200).json({ token });
      return res.status(400).send("UserId,appId,serverSecret is required");
    }
  } catch (error) {
    next(error);
  }
};

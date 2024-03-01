import getPrismaInstance from "../utils/PrismaClient.js";

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

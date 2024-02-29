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

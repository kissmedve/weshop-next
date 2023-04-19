import { connectDB } from "../../../utils/db";
import User from "../../../models/userModel";
import { hash } from "bcrypt";
import { randomString } from "../../../utils/randomString";

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, firstName, lastName, role, active } = req.body;

    // const randomStr = randomString();
    // const hashedPassword = await hash(randomStr, 10);
    const hashedPassword = await hash("hello123456", 10);

    const createUser = async () => {
      await connectDB();
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        role,
        active,
        password: hashedPassword,
      });
      res.json({
        status: 201,
        message: `User "${newUser.firstName} ${newUser.lastName}" created`,
        ...newUser,
      });
    };
    if (email && !email.includes("@")) {
      res.json({ status: 422, message: "Invalid email" });
      return;
    }

    if (email) {
      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        res.json({
          status: 422,
          message: "A user with this email has already been registered.",
        });
        return;
      }
      createUser();
    }

    if (!email && !lastName) {
      res.json({
        status: 422,
        message: "Invalid data. Please provide either email or name.",
      });
      return;
    }
    if (!email) {
      const lastNameExists = await User.findOne({ lastName: lastName });
      if (lastNameExists) {
        const fullNameExists = await User.findOne({
          lastName: lastName,
          firstName: firstName,
        });
        if (fullNameExists) {
          res.json({
            status: 422,
            message:
              "A user with the same name (last and first) has already been registered. Please make the first name unique.",
          });
          return;
        }

        createUser();
      }

      createUser();
    }
  } else {
    res.json({
      status: 500,
      message: "Route not valid.",
    });
  }
};

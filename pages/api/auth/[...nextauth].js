import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../utils/db";
import User from "../../../models/userModel";
import { compare } from "bcrypt";

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        await connectDB();
        console.log("connecting");
        console.log("credentials.email", credentials.email);
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("EMAIL/password combination not valid.");
        }
        console.log("plaintextPW", credentials.password);
        console.log("hashedPW", user.password);
        const matchPassword = await compare(
          credentials.password,
          user.password
        );
        console.log("matchPassword", matchPassword);
        if (!matchPassword) {
          throw new Error("Email/PASSWORD combination not valid.");
        }
        console.log("user.role", user.role);
        console.log("user.firstName", user.firstName);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token._id = user._id;
      }
      return token;
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user._id = token._id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/auth/signin",
  },
});

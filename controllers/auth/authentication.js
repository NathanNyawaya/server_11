import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import confirmToken from "../../models/Token.js";
import { verifyEmail, successfullRegistered } from "../../utils/sendEmail.js";

dotenv.config();

const router = express.Router();

// SESSION MIDDLEWARE
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 36000, // sec
    }),
  })
);

// Initialize Passport.js and add session middleware
router.use(passport.initialize());
router.use(passport.session());

// Register new user and log them in
export const registerUser = async (req, res, next) => {
  console.log("register user");
  try {
    const { fullName, username, phoneNumber, email, password } =
      req.body;

    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "User with the same username or email already exists",
      });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        status: "active",
      });

      const user = await newUser.save();
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          emailConfirm: user.emailConfirm,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      // Generate confirmation token
      // const newConfirmToken = new confirmToken({
      //   userID: user._id,
      //   confirmCode: Math.floor(100000 + Math.random() * 900000).toString(),
      // });

      // await newConfirmToken.save();
      // await verifyEmail(user.email, newConfirmToken.confirmCode);
      res.status(200).json({ token: token, message: "Success Registration" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error. Please contact support if the error persists.",
    });
  }
};
// add user

export const addUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      fullName,
      username,
      phoneNumber,
      email,
      password,
      role,
      eventList,
      balance,
      creditRef,
      exposureLimit
    } = req.body;

    const amountToChild =  balance

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "User with the same username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = {
      systemControl: [
        "king",
        "mainAdmin",
        "admin",
        "master",
        "super",
        "panel",
        "normalUser",
      ],
      king: ["mainAdmin"],
      mainAdmin: ["admin"],
      admin: ["master"],
      master: ["super"],
      super: ["panel"],
      panel: ["normalUser"],
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userRoles = allowedRoles[decoded.role];
    if (!userRoles || !userRoles.includes(role)) {
      return res.status(400).json({
        statusCode: 400,
        message: `You don't have permission to add ${role}`,
      });
    }

    
    const parent = await User.findById(decoded.id);
    const parentBal = parent.availableBalance;
    if (parentBal >= amountToChild) {
      const bal = parentBal - amountToChild;
      parent.balance = bal;
      parent.availableBalance = bal;
      await parent.save();
    } else {
      return res.status(400).json({
        statusCode: 400,
        message: `Insufficient credits to allocate for ${role} user`,
      });
    }

    const child = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      phoneNumber,
      role,
      creditRef,
      balance,
      availableBalance: balance,
      exposureLimit,
      status: "active",
      createdBy: decoded.id,
      eventList: eventList.length > 0 ? eventList : parent.eventList
    });

    // Save the new user
    const user = await child.save();

    // Add the new user to the admin's children array
    parent.children.push(user._id);
    await parent.save();

    const newToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailConfirm: user.emailConfirm,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      token: newToken,
      statusCode: 200,
      message: "User added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error. Please contact support if the error persists.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const toDelete = req.body;
    // const userId = mongoose.Types.ObjectId(toDelete._id); // Convert to ObjectId

    await User.findByIdAndDelete(toDelete.user._id);
    res.status(200).json({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error. Please contact support if the error persists.",
    });
  }
};


export const confirmEmail = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const checkCode = req.body.code;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const match = await confirmToken.findOne({
      userID: decoded.id,
      confirmCode: checkCode,
    });

    if (!match) {
      res.status(400).json({ message: "Invalid or Expired code" });
    }

    // Add emailConfirm: true to the token payload
    const tokenWithConfirmation = { ...decoded, emailConfirm: true };

    User.findOne({ _id: decoded.id })
      .then((user) => {
        if (user) {
          user.emailConfirm = true;
          return user.save();
        } else {
          // User not found
          throw new Error("User not found");
        }
      })
      .then((updatedUser) => {
        successfullRegistered(updatedUser.email);
        // console.log("User email confirmed:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });

    // Sign the modified token
    const modifiedToken = jwt.sign(
      tokenWithConfirmation,
      process.env.JWT_SECRET_KEY
    );

    return res
      .status(200)
      .json({ message: "Email Confirmation Success", token: modifiedToken });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Passport to use local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) return done(null, false, { message: "Invalid username" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return done(null, false, { message: "Invalid password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user for login sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const editPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const { password, password1 } = req.body.passcode;

    if (password && password1 && token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ _id: decoded.id });

      if (!user) {
        res.status(200).json({ statusCode: 404, message: "User document not found" });
        return;
      }
      const validPassword = await bcrypt.compare(password1, user.password);

      if (!validPassword) {
        res.status(200).json({ statusCode: 400, message: "Current password is incorrect" });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(password, 10);
      user.password = hashedNewPassword;

      await user.save();

      res.status(200).json({ statusCode: 200, message: "Password saved successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const loginUser = (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.status(200).json({
        statusCode: 500,
        message: "Server error. Please contact support if the error persists!",
      });
    }

    if (!user) {
      if (info.message === "Invalid username") {
        return res.status(200).json({
          success: false,
          statusCode: 400,
          message: "Invalid username",
        });
      } else if (info.message === "Invalid password") {
        return res.status(200).json({
          success: false,
          statusCode: 400,
          message: "Wrong password!",
        });
      }
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailConfirm: user.emailConfirm,
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { httpOnly: false, secure: false });

    // send cookie
    res.status(200).json({ token, statusCode: 200, message: "Successful" }); // send token
  })(req, res, next);
};

// Authentication middleware
export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const logoutUser = (req, res) => {
  console.log("logout hit");

  // Clear the JWT token from the client-side (e.g., cookies, local storage)
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
};

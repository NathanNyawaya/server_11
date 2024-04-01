import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const withDraw = async (req, res) => {
  console.log("withdraw user balance");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const transactionData = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const fromUser = await User.findById(transactionData.user_id);
    const toUser = await User.findById(decoded.id);
    if (!toUser || !fromUser) {
      return res.status(200).json({
        statusCode: 404,
        message: "User not found",
      });
    } else {
      const withdrawAmount = transactionData.amountToTransact;
      const fromUserBalance = fromUser.availableBalance;
      const toUserBalance = toUser.availableBalance;
      if (fromUserBalance >= withdrawAmount) {
        fromUser.availableBalance = fromUserBalance - withdrawAmount;
        fromUser.balance = fromUserBalance - withdrawAmount
        await fromUser.save();
        toUser.availableBalance = toUserBalance + withdrawAmount;
        toUser.balance = toUserBalance + withdrawAmount;
        await toUser.save();
        res.status(200).json({
          statusCode: 200,
          message: "Withdrawal process succesful",
        });
      } else {
        res.status(200).json({
          statusCode: 400,
          message: "Insufficient Funds",
        });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deposit = async (req, res) => {
  // console.log("deposit user balance");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const transactionData = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const toUser = await User.findById(transactionData.user_id);
    const fromUser = await User.findById(decoded.id);
    if (!toUser || !fromUser) {
      return res.status(200).json({
        statusCode: 404,
        message: "User not found",
      });
    } else {
      const depositAmount = transactionData.amountToTransact;
      const fromUserBalance = fromUser.availableBalance;
      const toUserBalance = toUser.availableBalance;
      if (fromUserBalance >= depositAmount) {
        fromUser.availableBalance = fromUserBalance - depositAmount;
        fromUser.balance = fromUserBalance - depositAmount
        await fromUser.save();
        toUser.availableBalance = toUserBalance + depositAmount;
        toUser.balance = toUserBalance + depositAmount;
        await toUser.save();
        res.status(200).json({
          statusCode: 200,
          message: "Transaction process succesful",
        });
      } else {
        res.status(400).json({
          statusCode: 400,
          message: "Oops, process canceled due to insufficient balance",
        });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const depositScCtl = async (req, res) => {
  // console.log("deposit user balance");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const transactionData = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const scCtlUser = await User.findById(decoded.id);
    if (!scCtlUser) {
      return res.status(200).json({
        statusCode: 404,
        message: "User not found",
      });
    } else {
      const depositAmount = parseFloat(transactionData.amountToTransact);
      scCtlUser.balance += depositAmount
      scCtlUser.availableBalance += depositAmount
      await scCtlUser.save();

      res.status(200).json({
        statusCode: 200,
        message: "Transaction process succesful",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const withdrawScCtl = async (req, res) => {
  console.log("withdraw user balance");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const transactionData = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const scCtlUser = await User.findById(decoded.id);
    if (!scCtlUser) {
      return res.status(200).json({
        statusCode: 404,
        message: "User not found",
      });
    } else {
      const withdrwaAmount = parseFloat(transactionData.amountToTransact);
      scCtlUser.balance -= withdrwaAmount
      scCtlUser.availableBalance -= withdrwaAmount
      await scCtlUser.save();

      res.status(200).json({
        statusCode: 200,
        message: "Transaction process succesful",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

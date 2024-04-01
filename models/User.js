import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 6,
    },
    lastName: {
      type: String,
      min: 6,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    phoneNumber: {
      type: String,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "normalUser"
    },
    status: {
      type: String,
      default: "active"
    },
    refPL: {
      type: Number,
      default: 0
    },
    availableBalance: {
      type: Number,
      default: 0
    },
    exposureLimit: {
      type: Number,
      default: 0,
    },
    exposure: {
      type: Number,
      default: 0
    },
    partnership: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    creditRef: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: String,
    },
    eventList: {
      type: Array,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 
  },
  { timestamps: true }
);

var User = mongoose.model("User", UserSchema);
export default User;

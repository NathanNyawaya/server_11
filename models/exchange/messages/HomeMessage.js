import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    message: { type: String }
},
    { timestamps: true }
);

var HomeMessage = mongoose.model("HomeMessage", eventSchema);
export default HomeMessage;

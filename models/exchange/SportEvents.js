import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    events: { type: Array },
});

var SportEvents = mongoose.model("SportEvents", eventSchema);
export default SportEvents;

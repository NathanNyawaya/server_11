import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    events: { type: Array },
});

var InplaySportEvents = mongoose.model("InplaySportEvents", eventSchema);
export default InplaySportEvents;

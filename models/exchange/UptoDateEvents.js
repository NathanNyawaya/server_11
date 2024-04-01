import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    events: { type: Array },
});

var UptoDateEvents = mongoose.model("UptoDateEvents", eventSchema);
export default UptoDateEvents;

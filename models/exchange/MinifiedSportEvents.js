import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    events: { type: Array },
});

var MinifiedSportEvents = mongoose.model("MinifiedSportEvents", eventSchema);
export default MinifiedSportEvents;

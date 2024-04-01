import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    events: { type: Array },
});

var PopularEvents = mongoose.model("PopularEvents", eventSchema);
export default PopularEvents;

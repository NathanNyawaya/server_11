import mongoose from "mongoose";


const eventsSchema = new mongoose.Schema({
    events: { type: Array },
});

var EventTypes = mongoose.model("EventTypes", eventsSchema);
export default EventTypes;

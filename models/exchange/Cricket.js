import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    id: { type: String },
    cricket_data: { type: Object }

});

var CricketExchangeEvent = mongoose.model("CricketExchangeEvent", eventSchema);
export default CricketExchangeEvent;

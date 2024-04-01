import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    id: { type: String },
    cricket_data: { type: Object }

});

var FootballExchangeEvent = mongoose.model("FootballExchangeEvent", eventSchema);
export default FootballExchangeEvent;

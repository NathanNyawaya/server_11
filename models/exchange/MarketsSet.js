import mongoose from "mongoose";

const marketsSetSchema = new mongoose.Schema({
    eventTypeId: { type: String },
    sportName: { type: String },
    markets: { type: Array },
});

var MarketsSet = mongoose.model("MarketsSet", marketsSetSchema);
export default MarketsSet;

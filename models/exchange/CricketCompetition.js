import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
    competitions: { type: Object }
});

var CricketExchangeCompetition = mongoose.model("CricketExchangeCompetition", competitionSchema);
export default CricketExchangeCompetition;

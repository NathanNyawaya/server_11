import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
    competitions: { type: Object }
});

var CompetitionCopyCat = mongoose.model("CompetitionCopyCat", competitionSchema);
export default CompetitionCopyCat;

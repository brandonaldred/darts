import mongoose, { Schema } from 'mongoose';

const rankSchema = new Schema({
    username: String,
    rank: Number,
    type: String
   }, {
    timestamps: true,
 });

 const Rank = mongoose.models.Rank || mongoose.model('Rank', rankSchema);

 export default Rank;
import mongoose, { Schema } from 'mongoose';

const inningSchema = new Schema({
   score: String, // You can change the data type as needed
   darts: [Number],
});

const playerSchema = new Schema({
   firstName: String,
   username: String,
   rank: {},
   innings: [inningSchema],
});

const gameSchema = new Schema({
    name: { type: String, default: null },
    type: { type: String, default: null },
    players: [playerSchema],
    winner: { type: String, default: null },
    innings: { type: Number, default: 0 }
 }, {
    timestamps: true,
 })

 const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

 export default Game;
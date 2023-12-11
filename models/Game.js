import mongoose, { Schema } from 'mongoose';

const gameSchema = new Schema({
    playerOne: {
        username: String,
    },
    playerTwo: {
        username: String,
    },
    type: { type: String, default: null},
    innings: [],
    winner: { type: String, default: null}
 }, {
    timestamps: true,
 })

 const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

 export default Game;
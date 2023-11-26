import mongoose, { Schema } from 'mongoose';

const gameSchema = new Schema({
    playerOne: {
        userName: String,
    },
    playerTwo: String,
    type: String,
    turns: Number
 }, {
    timestamps: true,
 })

 const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

 export default Game;
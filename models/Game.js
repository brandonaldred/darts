import mongoose, { Schema } from 'mongoose';

const gameSchema = new Schema({
    name: { type: String, default: null },
    type: { type: String, default: null },
    players: [{ type: Schema.Types.Mixed }],
    winner: { type: String, default: null },
    innings: []
 }, {
    timestamps: true,
 })

 const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

 export default Game;
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    profileImage: String,
    rank: {
        "301": {type: Number, default: 1000},
        "501": {type: Number, default: 1000},
        "cricket": {type: Number, default: 1000},
        "aroundWorld": {type: Number, default: 1000},
        "threeHigh": {type: Number, default: 1000}
    },
    gamesPlayed: Number
 }, {
    timestamps: true,
 })

 const User = mongoose.models.User || mongoose.model('User', userSchema);

 export default User;
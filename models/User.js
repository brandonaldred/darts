import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    profileImage: String,
    rank: {
        "301": Number,
        "501": Number,
        "cricket": Number,
        "aroundWorld": Number,
        "threeHigh": Number
    },
    gamesPlayed: Number
 }, {
    timestamps: true,
 })

 const User = mongoose.models.User || mongoose.model('User', userSchema);

 export default User;
import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e)
    }
};

export default connectMongoDB;
import mongoose from "mongoose";

const connectMongoDB = async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
};

export default connectMongoDB;
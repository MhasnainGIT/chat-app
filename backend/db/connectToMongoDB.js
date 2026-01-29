import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        const uri = process.env.MONGO_DB_URI;

        if (!uri) {
            throw new Error("MONGO_DB_URI is not defined in .env");
        }

        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectToMongoDB;
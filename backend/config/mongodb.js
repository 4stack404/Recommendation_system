import mongoose from "mongoose";

const connectDB = async ()=>{

    // Connect to MongoDB
    mongoose.connection.on('connected', () => console.log("Database connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/Movies-Recommendations`)
};

export default connectDB;
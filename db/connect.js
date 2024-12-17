import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)

        console.log('Database was successfully connected.')
        return connection
    } catch (error) {
        console.error(error)
    }
}
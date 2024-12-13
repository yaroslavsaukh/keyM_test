import mongoose from "mongoose";

const Bookings = new mongoose.Schema(
    {
        user: { type: String, required: true },
        date: { type: String, required: true },
        startTime:{type: Date, required: true},
        endTime:{type: Date, required: true},
    }
)

export default mongoose.model('Bookings', Bookings)

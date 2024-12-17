import mongoose from "mongoose";

const BookingsSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        date: { type: Date, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
    {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id; // Convert _id to id
                delete ret._id; // Remove _id
                delete ret.__v; // Remove __v (optional)
            },
        },
        toObject: { virtuals: true }, // For consistency if you use toObject
    }
);

export default mongoose.model('Bookings', BookingsSchema);

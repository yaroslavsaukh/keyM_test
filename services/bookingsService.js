import createHttpError from "http-errors";
import Bookings from "../db/models/Bookings.js";


export const bookingCreate = async (booking) => {
    try{
        const {user, date, startTime, endTime} = booking
        return await Bookings.create({user, date, startTime, endTime})
    } catch (e) {
        throw createHttpError(e)
    }
}

export const allBookings = async () => {
    try {
        return await Bookings.find();
    } catch (error) {
        throw createHttpError(`Error fetching bookings: ${error.message}`);
    }
};

export const bookingById = async (id) => {
    try {
        const booking = await Bookings.findById(id);
        if (!booking) throw createHttpError("Booking not found");
        return booking;
    } catch (error) {
        throw createHttpError(`Error fetching booking: ${error.message}`);
    }
};

export const bookingUpdate = async (id, data) => {
    try {
        const updatedBooking = await Bookings.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBooking) throw createHttpError("Booking not found");
        return updatedBooking;
    } catch (error) {
        throw createHttpError(`Error updating booking: ${error.message}`);
    }
};

export const bookingDelete = async (id) => {
    try {
        const deletedBooking = await Bookings.findByIdAndDelete(id);
        if (!deletedBooking) createHttpError("Booking not found");
        return deletedBooking;
    } catch (error) {
        throw createHttpError(`Error deleting booking: ${error.message}`);
    }
};
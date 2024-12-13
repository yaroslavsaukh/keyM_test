import {allBookings, bookingById, bookingCreate, bookingDelete, bookingUpdate} from "../services/bookingsService.js";


export const createBooking = async (req, res) => {
    try {
        const{user, date, startTime, endTime} = req.body
        const booking = await bookingCreate({user, date, startTime, endTime});
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await allBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const {id} = req.params
        const booking = await bookingById(id);
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const{...fields} = req.body;
        const {id} = req.params;
        const updatedBooking = await bookingUpdate(id, fields);
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await bookingDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted successfully", deletedBooking });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
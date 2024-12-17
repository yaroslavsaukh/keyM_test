import {allBookings, bookingById, bookingCreate, bookingDelete, bookingUpdate} from "../services/bookingsService.js";
import { createBookingSchema} from "../validation/bookings/createBooking.js";
import createHttpError from "http-errors";
import {updateBookingSchema} from "../validation/bookings/updateBooking.js";
import {isAfter} from "date-fns";
import Bookings from "../db/models/Bookings.js";

const checkOverlap = async (user, date, startTime, endTime, excludeBookingId = null) => {
    const overlappingBooking = await Bookings.findOne({
        user,
        date,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
        ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
    });

    return overlappingBooking;
};



export const createBooking = async (req, res, next) => {
    try {
        const { error, value } = createBookingSchema.validate(req.body, { abortEarly: false });
        if (error) {
            throw createHttpError(400, error.details.map(detail => detail.message).join(", "));
        }

        const { user, date, startTime, endTime } = req.body;

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        const formattedDate = new Date(date);

        if (isAfter(startDateTime, endDateTime)) {
            throw createHttpError(400, "End time must be greater than start time");
        }

        // Check for overlapping bookings
        const overlappingBooking = await checkOverlap(user, formattedDate, startDateTime, endDateTime);
        if (overlappingBooking) {
            throw createHttpError(400, "Booking conflict: The selected time slot overlaps with an existing booking.");
        }

        const booking = await bookingCreate({ user, date: formattedDate, startTime: startDateTime, endTime: endDateTime });
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await allBookings();
        res.status(200).json(bookings);
    } catch (error) {
        next(error)
    }
};

export const getBookingById = async (req, res, next) => {
    try {
        const {id} = req.params
        const booking = await bookingById(id);
        res.status(200).json(booking);
    } catch (error) {
        next(error)
    }
};

export const updateBooking = async (req, res, next) => {
    try {
        const { error, value } = updateBookingSchema.validate(req.body, { abortEarly: false });
        if (error) {
            throw createHttpError(400, error.details.map(detail => detail.message).join(", "));
        }

        const { id } = req.params;
        const { date, startTime, endTime, ...otherFields } = value;

        let updatedFields = { ...otherFields };

        // Fetch the current booking if date is not provided but startTime or endTime is present
        let currentDate, currentStartTime, currentEndTime;
        if (!date && (startTime || endTime)) {
            const currentBooking = await Bookings.findById(id);
            if (!currentBooking) {
                throw createHttpError(404, "Booking not found");
            }
            currentDate = currentBooking.date;
            currentStartTime = currentBooking.startTime;
            currentEndTime = currentBooking.endTime;
        }

        // Determine the date to use (request body or current booking)
        const resolvedDate = date || currentDate;

        // Rebuild updatedFields with appropriate date, startTime, and endTime
        updatedFields = {
            ...updatedFields,
            ...(date ? { date } : {}),
            ...(startTime ? { startTime: new Date(`${resolvedDate}T${startTime}`) } : {}),
            ...(endTime ? { endTime: new Date(`${resolvedDate}T${endTime}`) } : {}),
        };

        // Validation: Ensure endTime > startTime using date-fns `isAfter`
        const newStartTime = updatedFields.startTime || currentStartTime;
        const newEndTime = updatedFields.endTime || currentEndTime;

        if (newStartTime && newEndTime && !isAfter(newEndTime, newStartTime)) {
            throw createHttpError(400, '"endTime" must be greater than "startTime".');
        }

        // Check for overlapping bookings
        const overlappingBooking = await checkOverlap(
            otherFields.user || currentBooking.user,
            resolvedDate,
            newStartTime,
            newEndTime,
            id
        );
        if (overlappingBooking) {
            throw createHttpError(400, "Booking conflict: The selected time slot overlaps with an existing booking.");
        }

        const updatedBooking = await bookingUpdate(id, updatedFields);
        res.status(200).json(updatedBooking);
    } catch (error) {
        next(error);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        const {id} = req.params;
        await bookingDelete(id);
        res.status(200).json({ message: "Booking deleted successfully"});
    } catch (error) {
        next(error)
    }
};
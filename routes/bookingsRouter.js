import {Router} from "express";
import {createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking} from "../controllers/bookings.js";
import {verifyToken} from "../middleware/verifyToken.js";

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API for managing bookings
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user making the booking
 *                 example: "63d9f4b0e07f1b001c7f2e3a"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the booking in YYYY-MM-DD format
 *                 example: "2024-12-15"
 *               startTime:
 *                 type: string
 *                 pattern: "^\\d{2}:\\d{2}$"
 *                 description: The start time in HH:mm format
 *                 example: "14:30"
 *               endTime:
 *                 type: string
 *                 pattern: "^\\d{2}:\\d{2}$"
 *                 description: The end time in HH:mm format
 *                 example: "16:00"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input or end time is before start time
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking deleted successfully"
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   patch:
 *     summary: Update a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "63d9f4b0e07f1b001c7f2e3a"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the booking in YYYY-MM-DD format
 *                 example: "2024-12-16"
 *               startTime:
 *                 type: string
 *                 pattern: "^\\d{2}:\\d{2}$"
 *                 description: The start time in HH:mm format
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 pattern: "^\\d{2}:\\d{2}$"
 *                 description: The end time in HH:mm format
 *                 example: "11:00"
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input or end time is before start time
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the booking
 *           example: "63d9f4b0e07f1b001c7f2e3b"
 *         user:
 *           type: string
 *           description: The ID of the user who made the booking
 *           example: "63d9f4b0e07f1b001c7f2e3a"
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the booking in YYYY-MM-DD format
 *           example: "2024-12-15"
 *         startTime:
 *           type: string
 *           pattern: "^\\d{2}:\\d{2}$"
 *           description: The start time in HH:mm format
 *           example: "14:30"
 *         endTime:
 *           type: string
 *           pattern: "^\\d{2}:\\d{2}$"
 *           description: The end time in HH:mm format
 *           example: "16:00"
 */

const bookingsRouter = Router()

bookingsRouter.post('/', createBooking);
bookingsRouter.get('/', getAllBookings);
bookingsRouter.get('/:id', getBookingById)
bookingsRouter.delete('/:id', deleteBooking)
bookingsRouter.patch('/:id', updateBooking)

export default bookingsRouter
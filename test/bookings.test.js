import { expect } from 'chai';
import sinon from 'sinon';
import createHttpError from 'http-errors';
import {createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking} from "../controllers/bookings.js";
import Bookings from "../db/models/Bookings.js";

describe('createBooking', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                user: 'user123',
                date: '2024-12-20',
                startTime: '10:00',
                endTime: '11:00',
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if validation fails', async () => {
        req.body = { user: '', date: 'invalid-date', startTime: '25:00', endTime: '24:00' };

        await createBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
    });

    it('should return 400 if endTime is less than or equal to startTime', async () => {
        req.body.startTime = '11:00';
        req.body.endTime = '10:00';

        await createBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('End time must be greater than start time');
    });

    it('should return 400 if there is an overlapping booking', async () => {
        sinon.stub(Bookings, 'findOne').resolves({});

        await createBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('Booking conflict: The selected time slot overlaps with an existing booking.');
    });

    it('should create a booking successfully', async () => {
        sinon.stub(Bookings, 'findOne').resolves(null);
        sinon.stub(Bookings, 'create').resolves({ id: 'booking123', ...req.body });

        await createBooking(req, res, next);

        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        const jsonResponse = res.json.firstCall.args[0];
        expect(jsonResponse).to.have.property('id', 'booking123');
    });

    it('should handle database errors gracefully', async () => {
        sinon.stub(Bookings, 'findOne').throws(new Error('Database error'));

        await createBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Database error');
    });
});

describe('getAllBookings', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all bookings successfully', async () => {
        const mockBookings = [
            { id: 'booking1', user: 'user1', date: '2024-12-20', startTime: '10:00', endTime: '11:00' },
            { id: 'booking2', user: 'user2', date: '2024-12-21', startTime: '12:00', endTime: '13:00' },
        ];

        sinon.stub(Bookings, 'find').resolves(mockBookings);

        await getAllBookings(req, res, next);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith(mockBookings)).to.be.true;
    });

    it('should handle errors when fetching bookings', async () => {
        const errorMessage = 'Database error';
        sinon.stub(Bookings, 'find').throws(new Error(errorMessage));

        await getAllBookings(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal(errorMessage);
    });
});


describe('getBookingById', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                id: 'booking123',
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return a booking by ID successfully', async () => {
        const mockBooking = { id: 'booking123', user: 'user1', date: '2024-12-20', startTime: '10:00', endTime: '11:00' };

        sinon.stub(Bookings, 'findById').resolves(mockBooking);

        await getBookingById(req, res, next);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith(mockBooking)).to.be.true;
    });

    it('should handle errors when booking not found', async () => {
        sinon.stub(Bookings, 'findById').resolves(null);

        await getBookingById(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.message).to.equal('Error fetching booking: Booking not found');
    });

    it('should handle database errors gracefully', async () => {
        const errorMessage = 'Database error';
        sinon.stub(Bookings, 'findById').throws(new Error(errorMessage));

        await getBookingById(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include(errorMessage);
    });
});

describe('deleteBooking', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                id: 'booking123',
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a booking successfully', async () => {
        sinon.stub(Bookings, 'findByIdAndDelete').resolves({ id: 'booking123' });

        await deleteBooking(req, res, next);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Booking deleted successfully' })).to.be.true;
    });

    it('should handle errors when booking not found', async () => {
        sinon.stub(Bookings, 'findByIdAndDelete').resolves(null);

        await deleteBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.message).to.equal('Error deleting booking: Booking not found');
    });

    it('should handle database errors gracefully', async () => {
        const errorMessage = 'Database error';
        sinon.stub(Bookings, 'findByIdAndDelete').throws(new Error(errorMessage));

        await deleteBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.include(errorMessage);
    })
})

describe('updateBooking', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { id: 'booking123' },
            body: {
                date: '2024-12-20',
                startTime: '10:00',
                endTime: '11:00',
                user: 'user123',
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if validation fails', async () => {
        req.body = { date: 'invalid-date', startTime: '25:00', endTime: '24:00' };

        await updateBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
    });

    it('should return 400 if endTime is less than or equal to startTime', async () => {
        req.body.startTime = '11:00';
        req.body.endTime = '10:00';

        sinon.stub(Bookings, 'findById').resolves({ date: '2024-12-20', startTime: '10:00', endTime: '11:00' });

        await updateBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('"endTime" must be greater than "startTime".');
    });

    it('should return 400 if there is an overlapping booking', async () => {
        sinon.stub(Bookings, 'findById').resolves({ date: '2024-12-20', startTime: '10:00', endTime: '11:00' });
        sinon.stub(Bookings, 'findOne').resolves({});

        await updateBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('Booking conflict: The selected time slot overlaps with an existing booking.');
    });

    it('should update a booking successfully', async () => {
        const mockBooking = { id: 'booking123', ...req.body };

        sinon.stub(Bookings, 'findById').resolves({ date: '2024-12-20', startTime: '10:00', endTime: '11:00', user: 'user123' });
        sinon.stub(Bookings, 'findOne').resolves(null);
        sinon.stub(Bookings, 'findByIdAndUpdate').resolves(mockBooking);

        await updateBooking(req, res, next);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith(mockBooking)).to.be.true;
    });

    it('should handle database errors gracefully', async () => {
        sinon.stub(Bookings, 'findById').throws(new Error('Database error'));

        await updateBooking(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
    });
});
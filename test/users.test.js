import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import Users from "../db/models/Users.js";
import {login, register} from "../controllers/users.js"
import {findUserByUsername} from "../services/usersService.js";

describe('register', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                password: 'password123',
                name: 'Test User',
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
        req.body = { username: '', password: 'short', name: '' };

        await register(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(createHttpError.HttpError);
        expect(error.status).to.equal(400);
    });

    it('should return 401 if user creation fails', async () => {
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword123');
        sinon.stub(Users, 'create').resolves(null);

        await register(req, res, next);

        expect(res.status.calledOnceWith(401)).to.be.true;
        expect(res.json.calledOnceWith({})).to.be.true;
    });

    it('should handle errors gracefully', async () => {
        sinon.stub(bcrypt, 'hash').throws(new Error('Hashing error'));

        await register(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal('Hashing error');
    });
});
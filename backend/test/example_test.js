const sinon = require('sinon');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const { expect } = chai;

describe('protect middleware', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should call next if token is valid', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const req = {
            headers: { authorization: 'Bearer validtoken' }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.spy();

        sinon.stub(jwt, 'verify').returns({ id: fakeUserId });

        const fakeUser = { _id: fakeUserId, name: 'Test User' };
        sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves(fakeUser)
        });

        await protect(req, res, next);

        expect(req.user._id.toString()).to.equal(fakeUserId.toString());
        expect(req.user.name).to.equal('Test User');
        expect(next.calledOnce).to.be.true;
    });



    it('should return 401 if token is invalid', async () => {
        const req = {
            headers: { authorization: 'Bearer invalidtoken' }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        const next = sinon.spy();

        sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

        await protect(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Not authorized, token failed' })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 401 if no token is provided', async () => {
        const req = { headers: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        const next = sinon.spy();

        await protect(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Not authorized, no token' })).to.be.true;
        expect(next.called).to.be.false;
    });
});

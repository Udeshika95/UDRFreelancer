const sinon = require('sinon');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const Gig = require('../models/Gig');
const {
    saveGig,
    viewAllGigs,
    viewGigsByClient,
    deleteGig,
    editGig
} = require('../controllers/clientController');
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

// Gig related Test cases
describe('Gig Controller', () => {

    afterEach(() => {
        sinon.restore();
    });


    it('should handle error when saving gig', async () => {
        const req = { body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig.prototype, 'save').rejects(new Error('Save failed'));

        await saveGig(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Save failed' })).to.be.true;
    });


// ---------- viewAllGigs ----------
describe('viewAllGigs', () => {
    it('should return all gigs', async () => {
        const fakeGigs = [{ gigName: 'Gig1' }];
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'find').resolves(fakeGigs);

        await viewAllGigs(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeGigs)).to.be.true;
    });

    it('should handle error when fetching gigs', async () => {
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'find').rejects(new Error('DB error'));

        await viewAllGigs(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'DB error' })).to.be.true;
    });
});

// ---------- viewGigsByClient ----------
describe('viewGigsByClient', () => {
    it('should return gigs for a client', async () => {
        const clientId = new mongoose.Types.ObjectId().toString();
        const fakeGigs = [{ gigName: 'Gig1', clientId }];
        const req = { params: { clientId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'find').withArgs({ clientId }).resolves(fakeGigs);

        await viewGigsByClient(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(fakeGigs)).to.be.true;
    });

    it('should handle error when fetching gigs by client', async () => {
        const req = { params: { clientId: '123' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'find').rejects(new Error('DB error'));

        await viewGigsByClient(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'DB error' })).to.be.true;
    });
});

// ---------- deleteGig ----------
describe('deleteGig', () => {
    it('should delete gig successfully', async () => {
        const gigId = new mongoose.Types.ObjectId().toString();
        const req = { params: { id: gigId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'findByIdAndDelete').withArgs(gigId).resolves({ _id: gigId });

        await deleteGig(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: 'Gig deleted successfully' })).to.be.true;
    });

    it('should return 404 if gig not found', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'findByIdAndDelete').resolves(null);

        await deleteGig(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Gig not found' })).to.be.true;
    });
});

// ---------- editGig ----------
describe('editGig', () => {
    it('should edit gig successfully', async () => {
        const gigId = new mongoose.Types.ObjectId().toString();
        const updatedGig = { gigName: 'Updated Gig' };
        const req = { params: { id: gigId }, body: updatedGig };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'findByIdAndUpdate').withArgs(gigId, updatedGig, { new: true }).resolves(updatedGig);

        await editGig(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(updatedGig)).to.be.true;
    });

    it('should return 404 if gig not found', async () => {
        const req = { params: { id: '123' }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        sinon.stub(Gig, 'findByIdAndUpdate').resolves(null);

        await editGig(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Gig not found' })).to.be.true;
    });
});

});
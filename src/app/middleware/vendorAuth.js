const jwt = require('jsonwebtoken');
const config = require('../../environment/environment');
const Vendor = require('../models/vendor');
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.privateKey);
        const vendor = await Vendor.findOne({ _id: decoded._id, token : token });
        if (!vendor) {
            throw new Error('Please Authenticate.')
        }
        req.vendor = vendor;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: e.message });
    }
}
module.exports = auth;
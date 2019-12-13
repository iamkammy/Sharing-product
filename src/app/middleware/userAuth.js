const jwt = require('jsonwebtoken');
const config = require('../../environment/environment');
const User = require('../models/user');
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.privateKey);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error('Please Authenticate.')
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: e.message });
    }
}
module.exports = auth;
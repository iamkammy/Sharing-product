const router = require('express').Router();
const auth = require('../middleware/userAuth');
const User = require('../models/user');
router.post('/', auth, async(req, res) => {
    try {
        req.user.products = req.user.products.concat(req.body);
        await req.user.save();
        res.status(200).json({ status: 'success', message: 'Successfully inserted.' });
    } catch (e) {
        res.status(500).json({ status: 'Failure', message: e.message });
    }
});
router.get('/getProducts', auth, async(req, res) => {
    try {
        const { _id } = req.user;
        const { products } = await User.findById(_id);
        const myproduts = [];
        let limit = 10;
        let skip = 0;
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.skip) {
            skip = req.query.skip;
        }
        for (let i = skip; i < limit; i++) {
            if (products[i]) {
                myproduts.push(products[i]);
            }
        }
        res.status(200).json({ status: 'success', message: 'succefully get data', products: myproduts });
    } catch (e) {
        res.status(500).json({ status: 'Failure', message: e.message });
    }
});

module.exports = router;
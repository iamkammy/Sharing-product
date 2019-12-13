const App = require('../models/ecommerce');
const router = require('express').Router();
router.get('/list', async(req, res) => {
    try {
        const lists = await App.find({});
        res.status(200).json({ status: 'success', lists });
    } catch (e) {
        res.status(400).json({ status: 'Failure', message: e.message });
    }
});
router.post('/list', async(req, res) => {
    try {
        // const app = new App(req.body);
        // const apps = await app.save();
        const apps = await App.collection.insert(req.body);
        res.send({ apps });
    } catch (e) {
        res.send({ error: e.message });
    }
});
module.exports = router;
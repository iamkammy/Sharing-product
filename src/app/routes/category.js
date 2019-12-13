const router = require('express').Router();
const Category = require('../models/category');

router.get('/list', async (req,res,next)=> {
    try{
        const lists = await Category.find({});
        const response = {
            status: 'success',
            count : lists.length,
            lists
        }
        res.status(200).json(response);
    }catch(e){
        res.status(400).json({ status: 'Failure', message: e.message });
    }

})

router.post('/list', async (req, res, next) => {
    try {
        const categories = await Category.collection.insert(req.body);
        const response = {
            message : 'Categories Inserted Successfully',
            categories
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }

})

module.exports = router;
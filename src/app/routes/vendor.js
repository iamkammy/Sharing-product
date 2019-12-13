const router = require('express').Router();
const auth = require('../middleware/vendorAuth');
const { sendWelcomeEmail } = require('../emails/account')
const Vendor = require('../models/vendor');
const mongoose = require('mongoose');
const VendorController = require('../controller/vendorController');
router.post('/signup', async(req, res) => {
    const vendor = req.body;
    try {
        const obj = new Vendor(vendor);
        const token = await obj.getAuthToken();
        sendWelcomeEmail(obj.email, obj.companyName);
        await obj.save();
        res.status(201).json({ status: 'success', message: 'Successfully sign up!', token, _id: obj.id });
    } catch (e) {
        res.status(400).json({ status: 'Failure', message: e.message });
    }
});

router.post('/login', async(req, res) => {
    try {
        const vendor = await Vendor.findByCredential(req.body.phone, req.body.password);
        const token = await vendor.getAuthToken();
        res.status(200).send({ status: 'success', message: "Sign in successfully", companyName : vendor.companyName, vendor: vendor.getPublicProfile(), token });
    } catch (e) {
        res.status(400).json({ status: 'Failure', message: 'Invalid phone number or password' });
    }
});

router.post('/logout', auth, async (req, res, next)=>{
    try {
    req.vendor.token = '';
    await req.vendor.save();
    res.send(200).json({status : 'Success', message : 'Successfully Logged out'});        
    } catch (e) {
        res.status(400).json({error : 'Failed'});
    }
})

router.get('/productlist', async (req, res)=>{
    try {
        let vendor = await Vendor.findByPhone(req.body.phone);
        console.log(vendor);
        const lo = await Vendor.getProducts(vendor._id);
        console.log(lo);
        res.status(200).json(lo);
    } catch (e) {
        res.status(400).json({status: 'blast',error : e})
    }
})
router.get('/:phone', async (req, res)=> {
    try{
        await Vendor.findByPhone(req.params.phone);
        res.status(200).json({ message : 'Vendor already exist'});
    }catch(e){
        res.status(400).json({message : 'Vendor does not exist'});
    }
})


module.exports = router;
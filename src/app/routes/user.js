const router = require('express').Router();
const User = require('../models/user');
const auth = require('../middleware/userAuth');
const { sendWelcomeEmail } = require('../emails/account')
router.post('/signup', async(req, res) => {
    const user = req.body;
    try {
        const obj = new User(user);
        const token = await obj.getAuthToken();
        sendWelcomeEmail(obj.email, obj.name);
        await obj.save();
        res.status(201).json({ status: 'success', message: 'Successfully sign up!', token, _id: obj.id });
    } catch (e) {
        res.status(400).json({ status: 'Failure', message: e.message });
    }
});

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredential(req.body.phone, req.body.password);
        const token = await user.getAuthToken();
        res.status(200).send({ status: 'success', message: "Sign in successfully", user: user.getPublicProfile(), token });
    } catch (e) {
        res.status(400).json({ status: 'Failure', message: 'Invalid phone number or password' });
    }
});

router.post('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.status(200).send({ status: 'Success', message: 'Successfully logged out.' });
    } catch (e) {
        res.status(400).send({ error: 'wrong' });
    }
});

router.post('/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ status: 'Success', message: 'Successfully logged out.' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'wrong' });
    }
});

router.get('/:phone', async(req, res) => {
    try {
        await User.findByPhone(req.params.phone);
        res.status(200).json({ message: `User already exist.` });
    } catch (e) {
        res.status(200).json({ message: `User does not exist.` });
    }
});

router.get('/', (req, res)=> {
    User.find()
    .exec()
    .then(users => {
        let response = {
            status : 'Success',
            count : users.length,
            users : users.map(user => {
                return {
                    _id :      user._id,
                    name :     user.name,
                    phone :    user.phone,
                    email :    user.email,
                    deviceId : user.deviceId,
                    products : user.products
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        res.status(400).json ({ status :'Failed', error : err})
    })
   });

module.exports = router;
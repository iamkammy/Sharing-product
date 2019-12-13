const mongoose = require('mongoose');
const Schema = mongoose.Schema
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../environment/environment');
const ProductSchema = require('./product');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 12
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    deviceId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: (value) => {
            if (value.indexOf('pass') > -1) {
                throw new Error('Password should not contain pass as string.');
            }
        }
    },
    products: [ProductSchema],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
UserSchema.methods.getPublicProfile = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.tokens;
    delete userObject.password;
    delete userObject.deviceId;
    delete userObject.products;
    delete userObject.product;
    delete userObject.status;
    return userObject;
}
UserSchema.methods.getAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, config.privateKey);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
UserSchema.static('findByCredential', async function(phone, password) {
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
});


UserSchema.static('findByPhone', async function(phone) {
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error('User is not registered');
    }
    return user;
});

// hash pasword
UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
});
const User = new mongoose.model('User', UserSchema);
module.exports = User;
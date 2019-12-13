const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../environment/environment');

const User = require('../models/user');

const VendorSchema = new Schema({
    companyName : 
    {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 12
    },
    email : {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
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
    companyAddress : {
        type : String,
        required : true
    },
    token :{
        type : String,
        required : true
    },
    website : {
        type : String,
        required : true
    },
    category : [{
            type : String,
            required : true
     }],
     deviceId: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
 
} , {
    timestamps : true,
});

VendorSchema.methods.getPublicProfile = function(){
    const vendor = this;
    const vendorObject = vendor.toObject();
    delete vendorObject.token;
    delete vendorObject.password;
    delete vendorObject.deviceId;

    return vendorObject;
}
VendorSchema.methods.getAuthToken = async function(){
    const vendor = this;
    const token = jwt.sign({_id : vendor._id.toString() },  config.privateKey);
    vendor.token = token;
    await vendor.save();
    return token;
}
VendorSchema.static('findByCredential', async function(phone, password) {
    const vendor = await Vendor.findOne({ phone });
    if(!vendor) {
        throw new Error ('Unable to login');
    }
    const isMatch = await bcryptjs.compare(password, vendor.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return vendor;
})

VendorSchema.static('findByPhone', async function(phone){
    const vendor = await Vendor.findOne({ phone });
    if(!vendor){
        throw new Error('User is not registered');
    }
    return vendor;
});


VendorSchema.static('getProducts', async function(){
    const vendor  =  this;
    let temp = [];
    let vcategory = ['phone'];
    console.log(vcategory);
    const users = await User.find();
        users.map((user) => {
            if( vcategory.includes(user.products.subCategory)){
             temp.push(user.products.subCategory);
            }
         })
    
    return temp;
})
// hash pasword
VendorSchema.pre('save', async function(next) {
    const vendor = this;
    if (vendor.isModified('password')) {
        vendor.password = await bcryptjs.hash(vendor.password, 8);
    }
    next();
});

const Vendor = new mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;
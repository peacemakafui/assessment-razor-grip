const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Please enter a valid email']
        
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('user', userSchema);


module.exports = User;
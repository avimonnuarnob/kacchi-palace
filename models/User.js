const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const md5 = require('md5')
const validator = require('validator')
const momgodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply an email address!'
    },
    name: {
        type: String,
        required: 'Please Supply a name',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref:'Store' }
    ]
})

UserSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email)
    return `https://gravatar.com/avatar/${hash}?s=200`
})

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
UserSchema.plugin(momgodbErrorHandler)

module.exports = mongoose.model('User', UserSchema)
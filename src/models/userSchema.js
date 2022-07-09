const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    phoneNo: {
        type: String,
        required: true,
        unique: [true, "THIS NUMBER ALREADY EXIST"]
    },
    language: {
        lang: {
            type: String,


        },
        currency: {
            type: String,


        }
    },
    dob: {
        type: Date,

    },

    firstname: {
        type: String,

        minlength: 3
    },
    lastname: {
        type: String,

        minlength: 3
    },
    address: {
        houseno: {
            type: String,

        },
        street: {
            type: String,

        },
        city: {
            type: String,

        },
        state: {
            type: String,

        },
        zipcode: {
            type: String,

        },
        country: {
            type: String,

        },

    }
})

const idProof = new mongoose.Schema({
    issu_country: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,

    },
    front: {
        type: String,

    },
    back: {
        type: String,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phonenumber"
    },

})

const selfieSchema = new mongoose.Schema({
    selfie: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phonenumber"
    },
})




const emegencySchema = new mongoose.Schema({
    emergencyData: {
        emname: {
            type: String,
            required: true,
        },
        emnumber: {
            type: String,
            required: true,
        },
        emrelationship: {
            type: String,
            required: true,
        },
        ememail: {
            type: String,
            required: true,
        },
        emlanguage: {
            type: String,
            required: true,
        },
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User'
        // },
        phoneNo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Phonenumber"
        },
    }
})






const User = new mongoose.model('User', userSchema)
const Emergency = new mongoose.model('Emergency', emegencySchema);
const IdProof = new mongoose.model('IdProof', idProof);
const Selfie = new mongoose.model('Selfie', selfieSchema)
module.exports = { User, Emergency, IdProof, Selfie };
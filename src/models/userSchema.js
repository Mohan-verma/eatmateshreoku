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
    },
    emergencyData: {
        emname: {
            type: String,

        },
        emnumber: {
            type: String,

        },
        emrelationship: {
            type: String,

        },
        ememail: {
            type: String,

        },
        emlanguage: {
            type: String,

        },
    },
    idProof: {
        issu_country: {
            type: String,

        },
        type: {
            type: String,

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
    },
    selfie: {
        data: Buffer
    },

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
const googleSign = new mongoose.Schema({
    gtoken: {
        type: String,
        unique: [true, "already exist"]
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
    },
    emergencyData: {
        emname: {
            type: String,

        },
        emnumber: {
            type: String,

        },
        emrelationship: {
            type: String,

        },
        ememail: {
            type: String,

        },
        emlanguage: {
            type: String,

        },
    },
    idProof: {
        issu_country: {
            type: String,

        },
        type: {
            type: String,

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
    },
})
const facebooksign = new mongoose.Schema({
    ftoken: {
        type: String,
        unique: [true, "already exist"]
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
    },
    emergencyData: {
        emname: {
            type: String,

        },
        emnumber: {
            type: String,

        },
        emrelationship: {
            type: String,

        },
        ememail: {
            type: String,

        },
        emlanguage: {
            type: String,

        },
    },
    idProof: {
        issu_country: {
            type: String,

        },
        type: {
            type: String,

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
    },
})







const User = new mongoose.model('User', userSchema)
const Emergency = new mongoose.model('Emergency', emegencySchema);
const IdProof = new mongoose.model('IdProof', idProof);
const Selfie = new mongoose.model('Selfie', selfieSchema)
const GoogleSign = new mongoose.model('googleuser', googleSign)
const FacebookSign = new mongoose.model('facebookuser', facebooksign)

module.exports = { User, Emergency, IdProof, Selfie, GoogleSign, FacebookSign };
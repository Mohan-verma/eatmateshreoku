
const express = require('express')
require('dotenv').config()
const multer = require('multer')
require('./src/db/conn')
const { User, Emergency, IdProof, Selfie } = require('./src/models/userSchema')
const PORT = process.env.PORT || 3000;
const path = require('path');
const { create } = require('domain');

//twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
//twilio client


app = express();
app.use(express.json())

//multer storage
console.log(process.env.TWILIO_ACCOUNT_SID)
console.log(process.env.TWILIO_AUTH_TOKEN)
console.log(process.env.SECURITY)
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });



var idimages = upload.fields([{ name: "front" }, { name: "back" }, { name: "selfie" }])

const allpaths = `<br>/user-details (update user info) <br> /login (to register phone numberand get otp) <br> /verify (verify otp) <br> /emergency (to emergency details)`

//routes started 

// default page
app.get("/", (req, res) => {
    res.send(`THIS IS SERVER FOR EAT paths to post ${allpaths}`)
})
// app.get("/", (req, res) => {
//     res.send(`THIS IS SERVER FOR EAT paths to post `)
// })




// sent opt to mobile number

app.post("/login", (req, res) => {
    const number = req.body.number;

    console.log("number", number)

    if (number.length >= 13) {
        // console.log(req.body)
        const number = req.body.number;
        const chann = "sms";
        client
            .verify
            .services(process.env.SECURITY)
            .verifications
            .create({ to: number, channel: chann })
            // then statement twilio
            .then(data => {
                console.log(data)
                res.send("otp sent")
            })
            // error login invalid number
            .catch(err => {

                res.status(400).send(err)
            })
    }

    else {
        console.log("number is invalid invalid format plz ensure that you have filled your country code as well as number")
        res.send("number is invalid invalid format plz ensure that you have filled your country code as well as number")
    }

})



// check verified code of number
app.post('/verify', (req, res) => {

    const number = req.body.number;

    const codes = req.body.code;

    client.verify.services(process.env.SECURITY)
        .verificationChecks
        .create({ to: number, code: codes })
        .then(verification_check => {



            if (verification_check.status === "pending") {
                res.send("invalid OTP generate otp again")
            }
            else {


                const user = new User({
                    phoneNo: req.body.number,
                })


                user.save()
                    .then((resolve) => {
                        res.status(201).send({ message: " number registered", resolve })
                    })

                    .catch((err) => {


                        User.find({ phoneNo: req.body.number }, function (err, docs) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("First function call : ", docs);
                                res.send({ message: "User already exist ", docs })
                            }

                        });


                    })
            }

        })




})



//post users


app.put("/user-details", idimages, (req, res) => {
    user_id = req.body.numberid;
    // console.log(user_id)
    console.log(req.files)
    console.log(req.body)

    User.findByIdAndUpdate(user_id, {

        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dob: req.body.dob,
        language: {
            lang: req.body.lang,
            currency: req.body.currency
        },
        address: {
            houseno: req.body.houseno,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
        },
        emergencyData: {
            emname: req.body.emname,
            emnumber: req.body.emnumber,
            emrelationship: req.body.emrelationship,
            ememail: req.body.ememail,
            emlanguage: req.body.emlanguage,

        },
        idproof: {
            issu_country: req.body.issu_country,
            type: req.body.type,
            name: req.body.name,
            front: req.files.front[0]["filename"],
            back: req.files.back[0]["filename"],
            // user: req.body.user

        },
        selfie: req.files.selfie[0]["filename"],

    },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
                res.send({ message: "user registered", docs })
            }
        });
})



// app.post("/idproof", idimages, (req, res) => {
//     console.log("Id details", req.body)
//     const idproof = new IdProof({
//         issu_country: req.body.issu_country,
//         type: req.body.type,
//         name: req.body.name,
//         front: req.files.front[0]["filename"],
//         back: req.files.back[0]["filename"],
//         user: req.body.user
//     })
//     idproof.save()
//         .then((response) => {
//             console.log(response)
//             res.send({ message: "proofs uploaded", value: req.files })
//         })
//         .catch(err => {
//             console.log(err)
//             res.send(err)
//         })
// })



// selfie post

// app.post("/selfie", upload.single("selfie"), (req, res) => {
//     console.log("Id details", req.file)
//     const selfieup = new Selfie({
//         selfie: req.file["filename"],
//         user: req.body.user
//     })
//     selfieup.save()
//         .then((response) => {
//             console.log("selfie", response)
//             res.send({ message: "selfie uploaded", value: req.file })
//         })
//         .catch(err => {
//             console.log(err)
//             res.send(err)
//         })
// })

//end

//emergency post 
// app.post('/emergency', (req, res) => {
//     const emergency = new Emergency({

//         emergencyData: {
//             emname: req.body.emname,
//             emnumber: req.body.emnumber,
//             emrelationship: req.body.emrelationship,
//             ememail: req.body.ememail,

//             emlanguage: req.body.emlanguage,
//             // user: req.body.user,
//             phoneNo: req.body.phoneNo,
//         }

//     })


//     //emergency save
//     emergency.save().then((resolve) => {
//         console.log("emergencydetails saved", resolve)

//         res.json(resolve)

//     }).catch(err => {
//         console.log("emergency", err)
//     })
// })
//end 


// //get users







app.listen(PORT, () => {
    console.log(`you are listening to ${PORT}`)
})
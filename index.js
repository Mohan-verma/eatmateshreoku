
const express = require('express')
require('dotenv').config()
const multer = require('multer')
require('./src/db/conn')
const { User, Emergency, IdProof, Selfie, OtpNUmber } = require('./src/models/userSchema')
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });



var idimages = upload.fields([{ name: "front" }, { name: "back" }])

const allpaths = `<br>/idproof (for id add) <br> /users (to post user data) <br> /selfie (to post selfie photos) <br> /emergency (to emergency details)`

//routes started 

// default page
app.get("/", (req, res) => {
    res.send(`THIS IS SERVER FOR EAT paths to post ${allpaths}`)
})



// sent opt to mobile number
app.post("/login", (req, res) => {
    const number = req.body.number;



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
app.post("/verify", (req, res) => {





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

                const otpdata = new OtpNUmber({
                    Phonenumber: req.body.number,
                    status: verification_check.status,
                })
                otpdata.save({
                    Phonenumber: req.body.number
                })
                    .then(response => {
                        // const phone_id = response._id
                        // console.log(phone_id)
                        res.status(201).send({ Phone_id: response, message: "user save" })

                    }).catch(err => {
                        res.send(err)
                    })
            }

        })
        //error verification
        .catch(err => {
            console.log(err)
            if (err.status === 404)
                res.send("invalid otp")


        });


})




//post users


app.post("/users", (req, res) => {

    console.log("HELLO", req.body)

    const user = new User({
        phoneNo: req.body.phoneNo,
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
    })
    //user save
    user.save().then((resolve) => {
        console.log(resolve._id)
        res.send({ message: "user registered", value: req.body, userid: resolve._id })




    })
        .catch(err => {
            console.log(err)
        })
})


app.post("/idproof", idimages, (req, res) => {
    console.log("Id details", req.body)
    const idproof = new IdProof({
        issu_country: req.body.issu_country,
        type: req.body.type,
        name: req.body.name,
        front: req.files.front[0]["filename"],
        back: req.files.back[0]["filename"],
        user: req.body.user
    })
    idproof.save()
        .then((response) => {
            console.log(response)
            res.send({ message: "proofs uploaded", value: req.files })
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})



// selfie post

app.post("/selfie", upload.single("selfie"), (req, res) => {
    console.log("Id details", req.file)
    const selfieup = new Selfie({
        selfie: req.file["filename"],
        user: req.body.user
    })
    selfieup.save()
        .then((response) => {
            console.log("selfie", response)
            res.send({ message: "selfie uploaded", value: req.file })
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

//end

//emergency post 
app.post('/emergency', (req, res) => {
    const emergency = new Emergency({

        emergencyData: {
            emname: req.body.emname,
            emnumber: req.body.emnumber,
            emrelationship: req.body.emrelationship,
            ememail: req.body.ememail,

            emlanguage: req.body.emlanguage,
            // user: req.body.user,
            phoneNo: req.body.phoneNo,
        }

    })


    //emergency save
    emergency.save().then((resolve) => {
        console.log("emergencydetails saved", resolve)

        res.json(resolve)

    }).catch(err => {
        console.log("emergency", err)
    })
})
//end 


// //get users


app.get('/users', async (req, res) => {
    try {
        const alldata = await User.find()


        res.send(alldata)


    }
    catch (e) {
        res.send(e)
    }
    // try {
    //     const emer = await Emergency.find().populate("user")


    //     res.send(emer)


    // }
    // catch (e) {
    //     res.send(e)
    // }



})

// get by idd 
app.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const userdata = await Emergency.findById({ _id: _id })
        res.send(userdata)

    }
    catch (e) {
        res.send(e)
    }
})



// delete
app.delete('/users/:id', async (req, res) => {
    try {

        const deleteuser = await User.findByIdAndDelete(req.params.id)
        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send(deleteuser)


    }
    catch (e) {
        res.send(e)
    }
})
app.listen(PORT, () => {
    console.log(`you are listening to ${PORT}`)
})
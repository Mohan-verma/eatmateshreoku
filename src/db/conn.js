const mongoose = require('mongoose')
const url = "mongodb+srv://admin:admin@cluster0.wiojr.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log(`connection with db is successfull`)
})
    .catch((err) => {
        console.log(err)
    })
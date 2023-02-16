const mongoose = require('mongoose')
const DB = "mongodb+srv://alankjoseph:gTA7wceY9lWGVTDG@cluster0.qvoi94k.mongodb.net/crudApp?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected Successfull")
}).catch((error) => {
    console.log("ERROR! " + error.message)
});
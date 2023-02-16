const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    age: {
        type: String,
        required: [true, "Age is required"]
    },
    image: {
        type: String,
        default: null,
    },
    mobile: {
        type: Number,
        required: [true, "Mobile is required"]
    },
    job: {
        type: String,
        required: [true, "Job is required"]
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    accountType: {
        type: String,
        default: "user",
    }
    
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email:email})
    if (user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth) {
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect Email')
}

const users = new mongoose.model("users",userSchema);


module.exports = users;
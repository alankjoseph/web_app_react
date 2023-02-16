const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const users = require('../models/userSchema')
const upload  = require('../config/multer')
const fs = require('fs')



const maxAge = 3 * 24 * 60 * 60
const createToken = (id,email) => {
    return jwt.sign({ id,email }, "secret key", {
        expiresIn: maxAge
    })
}


const handleErrors = (err) => {
    let errors = { email: "", password: "", email: "", age: "", mobile: "", job: "" }
    if (err.code === 11000) {
        errors.email = "Email is already registered"
        return errors
    }

    if(err.message ==="incorrect Email") 
        errors.email = "that email is not registered"
    
        if(err.message ==="incorrect password") 
        errors.password = "that password is incorrect"


    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
   
}


router.post('/',(req, res, next)=>{
        const token = req.cookies.jwt
        if(token){
            jwt.verify(token,"secret key", async(err,decodedToken)=>{
                if(err){
                    res.json({status:false})
                    next()
                }else{
                    const user = await users.findById(decodedToken.id)
                    if(user) res.json({status:true,user:user.email,name:user.name,job:user.job,mobile:user.mobile,age:user.age,accountType:user.accountType})
                    else res.json({status:false})
                    next()
                }
            })
        }else{
            res.json({status:false})
            next()
        }
    }
)

// register user
router.post('/login', async (req, res) => {
    try {
        console.log( '----');
        console.log( req.body);
        console.log( '----');
        const {  email, password } = req.body

        const userLoged = await users.login(email, password)
        
        const token = createToken(userLoged._id,email)
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        })
        res.status(201).json({ userLoged: userLoged._id, created: true });


    } catch (err) {
        // res.status(404).json(error);
        console.log(err);
        const errors = handleErrors(err)
        res.json({ errors, created: false })

    }
})

router.post('/register', async (req, res) => {


    try {
        console.log('hhhhhhh ');
        const { name, email, password, age, mobile, job } = req.body

        const adduser = new users({
            name, email, password, age, mobile, job
        });
        await adduser.save();
        const token = createToken(adduser._id,email)
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000
        })
        res.status(201).json({ adduser: adduser._id, created: true });


    } catch (err) {
        // res.status(404).json(error);
        const errors = handleErrors(err)
        res.json({ errors, created: false })

    }
})

router.post("/addprofile/:id", async (req, res) => {
    const { id } = req.params;
    const image = req.files.image;
    const fileName = id;
    await image.mv('../uploads/' + fileName, (err, done) => {
        if (!err) {
            users.findByIdAndUpdate({ _id: id }, { image: fileName }).then(() => {
                res.send({ success: true });
            }).catch((e) => {
                console.log(e);
                res.send({ success: false, e });
            })
        } else {
            res.send({ success: false });
        }
    });
});

// get userData
router.get('/getData', async (req, res) => {
    try {
        const userData = await users.find({accountType: { $ne: "admin" }})
        res.send(userData)
    } catch (error) {
        res.status(404).json(error);
    }
})

// get individual user
router.get("/getUser/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const userindividual = await users.findById({ _id: id });
        res.status(201).json(userindividual)

    } catch (error) {
        res.status(422).json(error);
    }
})

// update user
router.patch('/updateUser/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updatedUser = await users.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.status(201).json(updatedUser)
    } catch (error) {
        res.status(401).json(error)
    }
})

// delete user
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await users.findByIdAndDelete({ _id: id })
        res.status(201).json(deleteUser)
    } catch (error) {
        res.status(401).json(error)
    }
})


module.exports = router
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser =  require('cookie-parser')
const users = require('./models/userSchema')
const fileUpload = require('express-fileupload')
const path = require('path');
const multer = require('multer')
const router = require('./routes/router')
require('dotenv').config()
require('./db/conn')

const app = express()

app.use(cors({
    origin:['http://localhost:3000'],
    methods:["GET","POST","DELETE"],
    credentials:true
}))
app.use(fileUpload())
app.use(cookieParser())
app.use(express.json())
app.use(router)

const port = 8000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
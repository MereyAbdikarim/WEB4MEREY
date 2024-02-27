const { connect } = require('http2');
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/Dayana')

// Проверка на подключение бд

db.then(() =>{
    console.log('Connect is successful');
})
.catch(() =>{
    console.log('Connect is not successful')
})

// create schema pon da
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type:  String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
})

// Collection 
const userCollection = new mongoose.model("users", userSchema);

module.exports = userCollection;
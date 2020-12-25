require('dotenv').config()
const mongoose = require('mongoose');
const url = process.env.DB

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected to database')) 

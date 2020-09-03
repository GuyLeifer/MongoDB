const mongoose = require('mongoose')
require('dotenv/config')

const url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const tutorialSchema = new mongoose.Schema({
    title: String,
    content: String,
    isPublished: Boolean,
    date: Date
})

const Tutorial = mongoose.model('Tutorial', tutorialSchema);
module.exports = Tutorial;
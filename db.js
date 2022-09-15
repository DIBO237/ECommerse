const mongoose = require("mongoose");
require('dotenv').config()



// MONGO DB CONNECTION
mongoose.connect(process.env.DATABASE_URL, {  useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

module.exports = db
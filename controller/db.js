const mongoose = require("mongoose")

require("dotenv").config()

const db_conn= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected");
    } catch (error) {
        console.log("Not Connected");
    }
}

module.exports = db_conn;
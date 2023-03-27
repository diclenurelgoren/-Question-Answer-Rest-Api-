const mongoose = require("mongoose");

const connectdatabase = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDb connect Successful");
        })
        .catch(err => {
            console.error("err");
        })
}

module.exports = connectdatabase;
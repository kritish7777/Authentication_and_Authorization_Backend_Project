const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    .then(() => {
        console.log("Database connection is successful");
    })
    .catch((error) => {
        console.log("Issue in connection");
        console.log(error);
        process.exit(1);
    })
}

module.exports = dbConnect;
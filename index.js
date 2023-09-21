const express = require("express");
const app = express();

app.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const dbConnect = require("./config/database");
dbConnect();

const router = require("./routes/user");
app.use("/api/v1",router);

app.listen(PORT,() => {
    console.log(`server is started at ${PORT}`);
})


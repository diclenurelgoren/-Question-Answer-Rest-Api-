const express = require("express");
const dotenv = require("dotenv");
const connectdatabase = require("./helpers/database/connectdatabase");
const customerrorHand = require("./middleware/error/CustomErrorHand");
const router = require("./routers/index.js");
const path = require("path");

dotenv.config({
    path: "./config/env/config.env"
})

connectdatabase();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", router);
app.use(customerrorHand);

app.listen(PORT, (req, res) => {
    console.log("Başarılı" + PORT);
});


const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { verify } = require("./Middlewares/privateApiMiddleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(verify);

const userRoutes = require("./Routes/userRoutes");
const urlGroupRoutes = require("./Routes/urlGroupRoutes");
const urlRoutes = require("./Routes/urlRoutes");

app.use("/user", userRoutes);
app.use("/urlGroup", urlGroupRoutes);
app.use("/url", urlRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    mongoose.connect(process.env.DATABASE_URL);
});

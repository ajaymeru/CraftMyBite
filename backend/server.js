require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.1.13:5173",
    "https://craft-my-bite-9rd9.vercel.app/"
];

const corsoptions = {
    origin: "*",  
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.options("*", cors(corsoptions)); 
app.use(cors(corsoptions));


app.use(express.json());

connectDB();

const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);

if (!process.env.VERCEL) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

app.get("/", (req, res) => {
    res.send("Server is running!");
});

module.exports = app;
const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/mongodbConnection");
const ejs = require("ejs");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const { sessionMid } = require("./authentication");
const path = require("path");

// importing_routes
const employeeRoutes = require("./routes/employeeRoutes");
const userRoutes = require('./routes/userRoutes');
const viewControllerRoutes = require('./routes/viewControllerRoutes');


const app = express();
const port = process.env.PORT || 5000;
connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(sessionMid);


app.use(express.static("public"));
app.use(express.static(path.join()));
app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));


app.use("/api/employees",employeeRoutes );
app.use("/api/users",userRoutes);
app.use("/", viewControllerRoutes)



app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

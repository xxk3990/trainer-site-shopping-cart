const express = require('express');
const cookieParser = require("cookie-parser")
const {sequelize} = require('./models');
const cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");
const process = require('process')
const router = require("./router");
const environment = process.env.NODE_ENV;
const app = express();
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3001", credentials:true}))
app.use(express.json());
const port = process.env.PORT || 3000

const connectToDB = async () => {
    console.log("connectToDB called")
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
}
(async () => {
    if(environment === "production") {
        try {
            await sequelize.authenticate();
            console.log("Connection with RDS has been established successfully.");       
        } catch (error) {
            console.error("Unable to connect to the RDS database:", error);
            process.exit(1);
        }
    } else {
        try {
            await connectToDB();
            console.log("Local connection to db successful.")
        } catch {
            console.log("Unable to connect at all.")
            process.exit(1);
        }
        
    }
})();
router(app);
app.listen(port, (err) => {
    if(err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
});

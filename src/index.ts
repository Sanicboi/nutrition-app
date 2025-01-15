import express, { Request } from "express"
import bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { User } from "./entity/User"
import { Auth, AuthRequest } from "./middleware/auth"
export const manager = AppDataSource.manager;
require("dotenv").config()
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())



    app.post("/api/login", Auth.login)


    app.post("/api/signup", Auth.signup);

    app.get("/api/me", Auth.authenticate, async (req: AuthRequest, res) => {
        res.status(200).json({
            username: req.user.username,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            age: req.user.age
        })
    })

    app.get("*", (req, res) => {
        res.status(200).json({
            ok: true
        });
    })





    // start express server
    app.listen(80)

}).catch(error => console.log(error))

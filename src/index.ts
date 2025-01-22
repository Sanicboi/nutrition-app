import express, { Request } from "express"
import bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import { Auth, AuthRequest } from "./middleware/auth"
import { User } from "./entity/User";
import dayjs from "dayjs";
export const manager = AppDataSource.manager;


interface IEditUser {
    username?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: number;
}

require("dotenv").config()
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())



    app.post("/api/login", Auth.login)


    app.post("/api/signup", Auth.signup);

    app.post("/api/deletiontoken",Auth.authenticate, Auth.authorizeDeletion);
    

    app.get("/api/me", Auth.authenticate, async (req: AuthRequest, res) => {
        res.status(200).json({
            username: req.user.username,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            dateOfBirth: req.user.dateOfBirth
        })
    });

    app.put("/api/me", Auth.authenticate, async (req: AuthRequest<IEditUser>, res): Promise<any> => {
        if (req.body.username) {
            const u2 = await manager.findOneBy(User, {
                username: req.body.username
            });
            if (u2) return res.status(409).end();
            req.user.username = req.body.username;
        }

        if (req.body.dateOfBirth)
            req.user.dateOfBirth = dayjs.unix(req.body.dateOfBirth).toDate()
        if (req.body.firstName)
            req.user.firstName = req.body.firstName;
        if (req.body.lastName)
            req.user.lastName = req.body.lastName;
        await manager.save(req.user);

        if (req.body.username) {
            const token = Auth.createToken(req.body.username);
            return res.status(200).json({
                token
            });
        }

        res.status(204).end();
    })

    app.delete("/api/me", Auth.authenticate, Auth.delete);

    

    app.get("*", (req, res) => {
        res.status(200).json({
            ok: true
        });
    });

    






    // start express server
    app.listen(80)

}).catch(error => console.log(error))

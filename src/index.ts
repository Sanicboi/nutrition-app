import express from "express"
import bodyParser from "body-parser"
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.get("*", (req, res) => {
        res.status(200).json({
            ok: true
        });
    })

    // start express server
    app.listen(80)

}).catch(error => console.log(error))

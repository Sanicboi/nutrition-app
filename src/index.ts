import * as express from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    

    // start express server
    app.listen(80)

}).catch(error => console.log(error))

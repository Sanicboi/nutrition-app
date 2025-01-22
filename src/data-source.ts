import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { DailyReport } from "./entity/DailyReport"
import { Exercise } from "./entity/Exercise"
import { ReportExercise } from "./entity/ReportExercise"
import { ReportFood } from "./entity/ReportFood"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5439,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, DailyReport, Exercise, ReportExercise, ReportFood],
    migrations: [],
    subscribers: [],
})

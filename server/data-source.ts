import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  database: "main",
  entities: [],
  username: "root",
  password: process.env.PG_PASS ?? "test",
  synchronize: true,
  logging: true,
});

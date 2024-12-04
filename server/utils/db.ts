import { AppDataSource } from "../data-source";
console.log("Initializing");
AppDataSource.initialize().catch(e => console.error(e));

export const db = AppDataSource;
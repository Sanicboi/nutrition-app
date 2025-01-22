import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm"
import { DailyReport } from "./DailyReport";

@Entity()
export class User {

    @PrimaryColumn()
    username: string;

    @Column({
        nullable: true
    })
    firstName: string

    @Column({
        nullable: true
    })
    lastName: string

    @Column({
        nullable: true
    })
    dateOfBirth: Date;

    @Column()
    password: string;


    @OneToMany(() => DailyReport, (report) => report.user)
    reports: DailyReport[];
}

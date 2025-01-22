import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DailyReport } from "./DailyReport";


@Entity()
export class ReportFood {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => DailyReport, (report) => report.food)
    @JoinColumn({
        name: "reportId"
    })
    report: DailyReport;

    @Column()
    reportId: string;

    @Column()
    mass: number;

    @Column()
    proteins: number;

    @Column()
    fats: number;

    @Column()
    carbs: number;

    @Column()
    calories: number;

    @Column()
    name: string;

    @Column()
    dish: number;

    @CreateDateColumn()
    date: Date;
}
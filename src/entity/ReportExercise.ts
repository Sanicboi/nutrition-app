import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise";
import { DailyReport } from "./DailyReport";




@Entity()
export class ReportExercise {


    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Exercise, (exercise) => exercise.reports)
    @JoinColumn({
        name: "exerciseId"
    })
    exercise: Exercise;

    @Column()
    exerciseId: string;

    @Column("real")
    duration: number;

    @Column("real")
    totalCalories: number;

    @ManyToOne(() => DailyReport, (report) => report.exercises)
    @JoinColumn({
        name: "reportId"
    })
    report: DailyReport;

    
}
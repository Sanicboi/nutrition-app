import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { ReportExercise } from "./ReportExercise";



@Entity()
export class DailyReport {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({
        name: "userId"
    })
    user: User;

    @Column()
    userId: string;

    @Column("array", {
        default: []
    })
    food: number[];

    @Column({
        default: 0
    })
    caloriesEaten: number;

    @Column({
        default: 0
    })
    proteinsEaten: number;

    @Column({
        default: 0
    })
    carbsEaten: number;

    @Column({
        default: 0
    })
    fatsEaten: number;

    @OneToMany(() => ReportExercise, (report) => report.report)
    exercises: ReportExercise[];

    caloriesBurnedByExercise(): number {
        return Math.round(this.exercises.reduce((acc, el) => acc + el.totalCalories, 0))
    }

    @Column()
    caloriesBurnedByRest: number;

    totalCalories(): number {
        return this.caloriesBurnedByExercise() + this.caloriesBurnedByRest;
    }

    @Column({
        default: 0
    })
    waterDrunkToday: number;

    @CreateDateColumn()
    date: Date;
}
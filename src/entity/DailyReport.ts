import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { ReportExercise } from "./ReportExercise";
import { ReportFood } from "./ReportFood";


export interface IDailyReportSerialized {
    id: string;
    userId: string;
    food: ReportFood[];
    exercises: ReportExercise[];
    caloriesBurnedByExercise: number;
    caloriesBurnedByRest: number;
    totalCaloriesBurned: number;
    totalCaloriesEaten: number;
    totalProteinsEaten: number;
    totalFatsEaten: number;
    totalCarbsEaten: number;
    waterDrunkToday: number;
    date: Date;
}


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

    @OneToMany(() => ReportFood, (report) => report.report)
    food: ReportFood[];

    @OneToMany(() => ReportExercise, (report) => report.report)
    exercises: ReportExercise[];

    @Column({
        default: 0
    })
    caloriesBurnedByRest: number;

    @Column({
        default: 0
    })
    waterDrunkToday: number;

    @Column()
    date: Date;

    caloriesBurnedByExercise(): number {
        return Math.round(this.exercises.reduce((acc, el) => acc + el.totalCalories, 0))
    }

    totalCaloriesBurned(): number {
        return this.caloriesBurnedByExercise() + this.caloriesBurnedByRest;
    }

    totalCaloriesEaten(): number {
        return this.food.reduce((acc, el) => acc + el.calories, 0);
    }

    totalFatsEaten(): number {
        return this.food.reduce((acc, el) => acc + el.fats, 0);
    }

    totalProteinsEaten(): number {
        return this.food.reduce((acc, el) => acc + el.proteins, 0);
    }

    totalCarbsEaten(): number {
        return this.food.reduce((acc, el) => acc + el.carbs, 0);
    }



    toSerialized(): IDailyReportSerialized {
        return {
            id: this.id,
            food: this.food,
            exercises: this.exercises,
            caloriesBurnedByExercise: this.caloriesBurnedByExercise(),
            caloriesBurnedByRest: this.caloriesBurnedByRest,
            totalCaloriesBurned: this.totalCaloriesBurned(),
            totalCaloriesEaten: this.totalCaloriesEaten(),
            totalCarbsEaten: this.totalCarbsEaten(),
            totalFatsEaten: this.totalFatsEaten(),
            totalProteinsEaten: this.totalProteinsEaten(),
            waterDrunkToday: this.waterDrunkToday,
            date: this.date,
            userId: this.userId
        }
    }
}



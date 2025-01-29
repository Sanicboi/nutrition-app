import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
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

interface INutritionData {
  totalCaloriesEaten: number;
  totalProteinsEaten: number;
  totalFatsEaten: number;
  totalCarbsEaten: number;
}

interface ITrainingData {
  caloriesBurnedByExercise: number;
  caloriesBurnedByRest: number;
  totalCaloriesBurned: number;
}

@Entity()
export class DailyReport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({
    name: "userId",
  })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => ReportFood, (report) => report.report)
  food: ReportFood[];

  @OneToMany(() => ReportExercise, (report) => report.report)
  exercises: ReportExercise[];

  @Column({
    default: 0,
  })
  caloriesBurnedByRest: number;

  @Column({
    default: 0,
  })
  waterDrunkToday: number;

  @Column()
  date: Date;

  trainingData(): ITrainingData {
    const ex = this.exercises.reduce((acc, el) => acc + el.totalCalories, 0);
    return {
      caloriesBurnedByExercise: ex,
      caloriesBurnedByRest: this.caloriesBurnedByRest,
      totalCaloriesBurned: ex + this.caloriesBurnedByRest,
    };
  }

  nutritionData(): INutritionData {
    return this.food.reduce<INutritionData>(
      (acc: INutritionData, el: ReportFood): INutritionData => ({
        totalCaloriesEaten: acc.totalCaloriesEaten + el.calories,
        totalCarbsEaten: el.carbs + acc.totalCarbsEaten,
        totalFatsEaten: acc.totalFatsEaten + el.fats,
        totalProteinsEaten: acc.totalProteinsEaten + el.proteins,
      }),
      {
        totalCaloriesEaten: 0,
        totalProteinsEaten: 0,
        totalCarbsEaten: 0,
        totalFatsEaten: 0,
      },
    );
  }

  toSerialized(): IDailyReportSerialized {
    const nutritionData = this.nutritionData();
    return {
      id: this.id,
      food: this.food,
      exercises: this.exercises,
      ...this.trainingData(),
      ...nutritionData,
      waterDrunkToday: this.waterDrunkToday,
      date: this.date,
      userId: this.userId,
    };
  }
}

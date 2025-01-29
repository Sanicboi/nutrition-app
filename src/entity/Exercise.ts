import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReportExercise } from "./ReportExercise";

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("real")
  caloriesPerMinute: number;

  @OneToMany(() => ReportExercise, (report) => report.exercise)
  reports: ReportExercise[];
}

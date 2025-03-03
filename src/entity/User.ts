import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import { DailyReport } from "./DailyReport";

@Entity()
export class User {
  @PrimaryColumn()
  username: string;

  @Column({
    nullable: true,
  })
  age: number;

  @Column({
    nullable: true,
  })
  weight: number;

  @Column({
    nullable: true,
  })
  height: number;

  @Column({
    nullable: true,
  })
  activityLevel: 'low' | 'medium' | 'high' | 'professional';

  @Column({
    default: false
  })
  filledProfile: boolean;

  @Column()
  password: string;

  @OneToMany(() => DailyReport, (report) => report.user)
  reports: DailyReport[];
}

import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Habit } from "./Habit";

@Entity()
export class HabitEntry {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(type => Habit, { eager: true , onDelete: 'CASCADE'})
  @JoinColumn({ name: "habit_id" })
  habit: Habit;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}

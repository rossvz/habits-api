import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Habit } from './Habit'
import moment from 'moment'
@Entity()
export class HabitEntry {
  @Index()
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @ManyToOne(type => Habit, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @Column()
  unixCreated: number

  @AfterLoad()
  convertTimetamp() {
    if (this.unixCreated === 0) {
      this.unixCreated = moment(this.created).unix()
    }
  }

  @BeforeInsert()
  insertUnixStamp() {
    this.unixCreated = moment().unix()
  }
}

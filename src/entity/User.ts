import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Habit } from './Habit'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(type => Habit, habit => habit.user, { cascade: true, eager: true })
  habits: Habit[]
}

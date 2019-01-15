import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './User'

@Entity()
export class Habit {
  @Index()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  category: string

  @Column()
  weight: number

  @ManyToOne(type => User, user => user.habits)
  user: User
}

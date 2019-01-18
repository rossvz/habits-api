import { Delete, Get, JsonController, OnNull, Post } from 'routing-controllers'
import { getConnectionManager, Repository } from 'typeorm'
import {
  EntityFromBody,
  EntityFromParam
} from 'typeorm-routing-controllers-extensions'
import { Habit } from '../entity/Habit'

@JsonController()
export class HabitController {
  private repo: Repository<Habit>
  constructor() {
    this.repo = getConnectionManager()
      .get()
      .getRepository(Habit)
  }

  @OnNull(200)
  @Get('/ping')
  ping() {
    return null
  }

  @Get('/habits')
  getAll() {
    return this.repo.find()
  }

  @Post('/habits')
  create(@EntityFromBody() habit: Habit) {
    return this.repo.save(habit)
  }

  @Delete('/habits/:id')
  delete(@EntityFromParam('id') habit: Habit) {
    return this.repo.remove(habit)
  }
}

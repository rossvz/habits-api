import { Delete, Get, JsonController, Post } from 'routing-controllers'
import { getConnectionManager, Repository } from 'typeorm'
import { EntityFromBody, EntityFromParam } from 'typeorm-routing-controllers-extensions'
import { Habit } from '../entity/Habit'

@JsonController()
export class HabitController {
  private repo: Repository<Habit>
  constructor() {
    this.repo = getConnectionManager()
      .get()
      .getRepository(Habit)
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
  delete(@EntityFromParam("id") habit: Habit){
    return this.repo.remove(habit)
  }
}

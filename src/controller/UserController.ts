import { Get, JsonController, OnNull, Post, QueryParam } from 'routing-controllers'
import { getConnectionManager, Repository } from 'typeorm'
import {
  EntityFromBody,
  EntityFromParam
} from 'typeorm-routing-controllers-extensions'
import { User } from '../entity/User'

@JsonController()
export class UserController {
  private repo: Repository<User>
  constructor() {
    this.repo = getConnectionManager()
      .get()
      .getRepository(User)
  }

  @Get('/users')
  @OnNull(404)
  async get (@QueryParam("email") email?: string) {
    const users = await this.repo.find(email ? { email } : {})
    return users.length ? users : null
  }

  @Get('/users/:userId')
  getOne(@EntityFromParam("userId") user: User){
    return user
  }

  @Get('/habits/users/:userId')
  getUserHabits(@EntityFromParam('userId') user: User) {
    return this.repo.find({ where: { user } })
  }

  @Post('/users')
  create(@EntityFromBody() user: User) {
    return this.repo.save(user)
  }
}

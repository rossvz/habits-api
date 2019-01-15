import { Get, HttpCode, JsonController, OnUndefined, Post, QueryParam } from 'routing-controllers'
import { getConnectionManager, Raw, Repository } from 'typeorm'
import { EntityFromBody } from 'typeorm-routing-controllers-extensions'
import { HabitEntry } from '../entity/HabitEntry'
import moment from 'moment'

@JsonController()
export class HabitEntryController {
  private repo: Repository<HabitEntry>

  constructor() {
    this.repo = getConnectionManager()
      .get()
      .getRepository(HabitEntry)
  }

  @Get('/entries')
  getAll() {
    return this.repo.find()
  }

  @Get('/entries/today')
  getTodayEntries(@QueryParam("userId") userId: string) {
    return this.repo.createQueryBuilder('entry')
      .leftJoinAndSelect('entry.habit','habit')
      .leftJoinAndSelect('habit.user','user',)
      .where('user.id = :userId',{userId})
      .andWhere('entry.created >= :today',{today: moment().startOf('day').format('YYYY-MM-DD')})
      .getMany()
  }

  @OnUndefined(204)
  @Post('/entries')
  async create(@EntityFromBody() entry: HabitEntry) {
    await this.repo.save(entry)
  }
}

import moment from 'moment'
import {
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  QueryParam
} from 'routing-controllers'
import { getConnectionManager, Repository } from 'typeorm'
import {
  EntityFromBody,
  EntityFromParam
} from 'typeorm-routing-controllers-extensions'
import { HabitEntry } from '../entity/HabitEntry'

type Period = 'day' | 'week' | 'month' | 'year'

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

  @Get('/entries/between')
  getBetween(
    @QueryParam('start') start: number,
    @QueryParam('end') end: number,
    @QueryParam('userId') userId: string
  ) {
    return this.repo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.habit', 'habit')
      .leftJoinAndSelect('habit.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('entry.unixCreated >= :start', {
        start: start / 1000
      })
      .andWhere('entry.unixCreated <= :end', {
        end: end / 1000
      })
      .getMany()
  }

  @Get('/entries/today')
  getTodayEntries(
    @QueryParam('userId') userId: string,
    @QueryParam('period') period: Period = 'day'
  ) {
    return this.repo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.habit', 'habit')
      .leftJoinAndSelect('habit.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('entry.created >= :start', {
        start: moment()
          .startOf(period)
          .format('YYYY-MM-DD')
      })
      .getMany()
  }

  @OnUndefined(204)
  @Post('/entries')
  async create(@EntityFromBody() entry: HabitEntry) {
    const newEntry = await this.repo.save(entry)
    return this.repo.findOne(newEntry.id)
  }

  @Delete('/entries/:id')
  async delete(@EntityFromParam('id') entry: HabitEntry) {
    const { id } = entry
    await this.repo.remove(entry)
    return { ...entry, id }
  }
}

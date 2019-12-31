import {
  BadRequestError,
  Body,
  BodyParam,
  Get,
  JsonController,
  NotFoundError,
  OnNull,
  Post,
  QueryParam
} from 'routing-controllers'
import bcrypt from 'bcrypt'
import { getConnectionManager, Repository } from 'typeorm'
import {
  EntityFromBody,
  EntityFromParam
} from 'typeorm-routing-controllers-extensions'
import { User } from '../entity/User'

type LoginCredentials = {
  email: string
  password: string
}

const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })

const comparePassword = (password: string, hash: any) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      resolve(!err)
    })
  })

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
  async get(@QueryParam('email') email?: string) {
    const users = await this.repo.find(email ? { email } : {})
    return users.length ? users : null
  }

  @Post('/login')
  @OnNull(401)
  async login(@Body() { email, password }: LoginCredentials) {
    const user = await this.repo.findOne({ email })
    if (!user) throw new NotFoundError('User not found')
    const hashedIncomingPassword = await hashPassword(password)
    const matchedPasswords = await comparePassword(user.password, hashedIncomingPassword)
    if (matchedPasswords) return user
    throw new BadRequestError('incorrect password')
  }

  @Post('/register')
  async register(@EntityFromBody() user: User) {
    const hashed = await hashPassword(user.password)
    const results = await this.repo.save({
      ...user,
      password: hashed
    })
    return {...user, id: results.id, habits: []}
  }

  @Get('/users/:userId')
  getOne(@EntityFromParam('userId') user: User) {
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

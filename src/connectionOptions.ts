import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

const connectionOptions: MysqlConnectionOptions = {
  type: 'mysql',
  timezone: 'Z',
  database: process.env.TYPEORM_DATABASE,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  port: 3306,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: true,
  entities: ['build/entity/*.js'],
  migrations: ['build/migrations/*.js'],
  subscribers: ['build/subscribers/*.js']
}

export default connectionOptions

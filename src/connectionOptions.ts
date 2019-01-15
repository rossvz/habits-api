import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

 const connectionOptions: MysqlConnectionOptions = {
  type: 'mysql',
  timezone: 'Z',
  database: process.env.TYPEORM_DATABASE,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  port: Number(process.env.TYPEORM_PORT),
  password: process.env.TYPEORM_PASSWORD,
   entities: ['build/entity/*.js'],
   migrations: ['build/migrations/*.js'],
   subscribers: ['build/subscribers/*.js'],

}

export default connectionOptions
require('dotenv').config()

import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import { createConnection } from 'typeorm'
import connectionOptions from './connectionOptions'

const PORT = process.env.PORT || 8383

createConnection(connectionOptions)
  .then(async connection => {
    const app = createExpressServer({
      cors: true,
      controllers: [__dirname + '/controller/*'],
      middlewares: [__dirname + '/middleware/*']
    })
    app.listen(PORT)
    console.log(`Running on port ${PORT}`)
  })
  .catch(error => console.log(error))

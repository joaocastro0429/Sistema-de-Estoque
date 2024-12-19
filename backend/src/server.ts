import express from 'express'
import { router } from './router/ProductRouter'
import { UserRouter } from './router/UserRouter'
import cors from 'cors'



const server=express()

server.use(express.json())
server.use(cors(
    {
      origin: 'http://localhost:5173',
      credentials: true,
    }
  
))

server.use(router)
server.use(UserRouter)

server.listen(4444)
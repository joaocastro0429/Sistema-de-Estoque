import express from 'express'
import { router } from './router/ProductRouter'
import { UserRouter } from './router/UserRouter'
import cors from 'cors'



const server=express()

server.use(express.json())
server.use(cors())

server.use(router)
server.use(UserRouter)

server.listen(process.env.PORT_URL||4444)

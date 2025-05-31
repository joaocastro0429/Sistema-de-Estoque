import express from 'express'
import { router } from './router/ProductRouter'
import { UserRouter } from './router/UserRouter'
import cors from 'cors'



const server=express()

server.use(express.json())
server.use(cors(
    {
            origin:
            'https://sistema-estoque-frontend.onrender.com'   
    }
))

server.use(router)
server.use(UserRouter)

server.listen(process.env.PORT_URL||3333)

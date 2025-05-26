import {prisma} from '../prisma/index'

export  const getById = async (id: number) => {
    return await prisma.user.findUnique({where: {id}})
}

export const getByEmail = async (email: string) => {
    return await prisma.user.findUnique({where: {email}})
}

export const create = async (data:{email:string, password:string}) => {
    const user = await prisma.user.create({
        data:{
            email: data.email,
            password: data.password
        }
        
    })
    if(user){
        throw new Error('User already exists')

    }

    return await prisma.user.create({
        data:{
            email: data.email,
            password: data.password
        }
})
}

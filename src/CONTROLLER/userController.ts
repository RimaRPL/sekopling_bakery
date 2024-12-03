import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import {promises} from "dns"
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const prisma = new PrismaClient({errorFormat:"minimal"})
type UserType = "Admin" | "Cashier"

/** CREATE */
const createUsers = async (req: Request, res: Response) : Promise<any> => {
    try {

        const user_name : string = req.body.user_name
        const user_email : string= req.body.user_email
        const user_password : string= req.body.user_password
        const user_role  : UserType = req.body.user_role

        const findEmail = await prisma.users
            .findFirst({ where: {user_email}})
        if(findEmail){
            return res.status(400)
                .json({message: `Email has exists`})
        }
        
        const hashPassword = await bcrypt.hash(user_password,12)
        const newUsers = await prisma.users.create({
            data: {
                user_name, user_email,user_password : hashPassword,user_role
            }
        })
        res.status(200)
        .json ({
            message: `New Users has been created`,
            data: newUsers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Read */
const readUsers = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const search = req.query.search
        const allUsers = await prisma.users.findMany({
            where:{
                OR:[{
                    user_name: {
                        contains: search?.toString() || ""
                    }
                }]
            }
        })
        return res.status(200).json({
            message: `User has been retrivied`,
            data: allUsers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Update */
const updateUsers = async (req: Request, res: Response) : Promise<any> =>  {
    try {
        
        const id = req.params.id

        const findUsers = await prisma.users
            .findFirst({
                where: {id: Number(id)}
            })
        
        if(!findUsers){
            return res.status(200)
            .json({
                message: `Users is not found`
            })
        }

        const {
            user_name, user_email, user_password, user_role
        } = req.body

       const saveUser = await prisma.users
            .update({
                where: {id: Number(id)},
                data: {
                    user_name: user_name ? user_name: findUsers.user_name,
                    user_email: user_email ? user_email : findUsers.user_email,
                    user_password: user_password ? await bcrypt.hash(user_password, 12) : findUsers.user_password,
                    user_role: user_role ? user_role : findUsers.user_role
                }
            })

            return res.status(200)
                .json({
                    message: `Users has been updated`,
                    data: saveUser
                })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteUsers = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const id = req.params.id

        const findUsers = await prisma.users
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findUsers){
            return res.status(200)
            .json({
                message: `Users is not found`
            })
        }

    
        const saveUsers= await prisma.users
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `Users has been removed`,
                data: saveUsers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

const authentication = async (req: Request, res: Response) : Promise<any> => {
    try {
        const {user_email, user_password} = req.body
        /** check existing email */
        const findUsers = await prisma.users.findFirst({
            where: {user_email}
        })

        if(!findUsers){
            return res.status(200)
            .json({
                message: `Email is not registered`
            })
        }

        const isMatchPassword = await bcrypt.compare(user_password, findUsers.user_password)

        if(!isMatchPassword){
            return res.status(200)
            .json({
                message: `Invalid password`
            })
        }

        const payload = {
            user_name: findUsers.user_name,
            user_email: findUsers.user_email
        }

        const signature = process.env.SECRET || ``

        const token = Jwt.sign(payload, signature)

        return res.status(200).json({
            logged: true,
            token,
            id: findUsers.id,
            user_name: findUsers.user_name,
            user_email: findUsers.user_email
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

export { createUsers, readUsers, updateUsers, deleteUsers, authentication}

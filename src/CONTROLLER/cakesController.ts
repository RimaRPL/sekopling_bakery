import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import { ROOT_DIRECTORY } from"../config"
import fs from "fs"
import {promises} from "dns"

const prisma = new PrismaClient({errorFormat:"minimal"})

/**Creat */
const createCakes = async (req: Request, res: Response) : Promise<any> => {
    try {
        const cakes_name = req.body.cakes_name
        const cakes_price: number = Number(req.body.cakes_price) 
        const best_before : Date = new Date(req.body.best_before)
        const cakes_flavor: string = req.body.cakes_flavor 
        const image : string = req.file?.filename || ``
        const newCakes = await prisma.cakes.create({
            data: {
                cakes_name, cakes_price, best_before, cakes_flavor, image
            }
        })
        res.status(200)
        .json ({
            message: `New cakes has been created`,
            data: newCakes
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Read */
const readCakes = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        const search = req.query.search
        
        const allCakes = await prisma.cakes.findMany({
            where:{
                OR:[{
                    cakes_name: {
                        contains: search?.toString() || ""
                    }
                }]
            }
        })
        return res.status(200).json({
            message: `Cakes has been retrivied`,
            data: allCakes
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Update */
const updateCakes = async (req: Request, res: Response) : Promise<any> =>  {
    try {
        
        const id = req.params.id

        const findCakes = await prisma.cakes
            .findFirst({
                where: {id: Number(id)}
            })
        
        if(!findCakes){
            return res.status(200)
            .json({
                message: `Cakes is not found`
            })
        }
        
        if(req.file){
           
            let oldFileName = findCakes.image
            
            let pathFile = `${ROOT_DIRECTORY}/public/cakes-photo/${oldFileName}`
            
            let existsFile = fs.existsSync(pathFile)

            if(existsFile && oldFileName !== ``){
                
                fs.unlinkSync(pathFile)
            }
        }

        const {
            cakes_name,cakes_price, best_before,cakes_flavor
        } = req.body

       const saveCakes = await prisma.cakes
            .update({
                where: {id: Number(id)},
                data: {
                    cakes_name: cakes_name ? cakes_name: findCakes.cakes_name,
                    cakes_price: cakes_price ? Number(cakes_price) : findCakes.cakes_price,
                    best_before: best_before ? new Date(best_before) : findCakes.best_before,
                    cakes_flavor: cakes_flavor ? cakes_flavor: findCakes.cakes_flavor,
                    image: req.file ? req.file.filename : findCakes.image

                }
            })

            return res.status(200)
                .json({
                    message: `Cakes has been updated`,
                    data: saveCakes
                })
    } catch (error) {
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteCakes = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        const id = req.params.id

        const findCakes = await prisma.cakes
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findCakes){
            return res.status(200)
            .json({
                message: `Cakes is not found`
            })
        }

        let oldFileName = findCakes.image
        let pathFile = `${ROOT_DIRECTORY}/public/cakes-photo/${oldFileName}`
        let existsFile = fs.existsSync(pathFile)

        if(existsFile && oldFileName !== ``){
            fs.unlinkSync(pathFile)
        }

        const saveCakes= await prisma.cakes
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `Cakes has been removed`,
                data: saveCakes
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

export { createCakes, updateCakes, readCakes, deleteCakes}
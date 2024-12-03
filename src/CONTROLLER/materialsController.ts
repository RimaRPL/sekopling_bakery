import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import {promises} from "dns"

const prisma = new PrismaClient({errorFormat:"minimal"})
type MaterialType = "Powder" | "Liquid" | "Solid"

/** CREATE */
const createMaterials = async (req: Request, res: Response) : Promise<any> => {
    try {
        const materials_name = req.body.materials_name
        const materials_price: number = Number(req.body.materials_price) 
        const materials_type : MaterialType = req.body.materials_type
        
        const newMaterials = await prisma.materials.create({
            data: {
                materials_name, materials_price,materials_type
            }
        })
        res.status(200)
        .json ({
            message: `New materials has been created`,
            data: newMaterials
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Read */
const readMaterials = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const search = req.query.search
        const allMaterials = await prisma.materials.findMany({
            where:{
                OR:[{
                    materials_name: {
                        contains: search?.toString() || ""
                    }
                }]
            }
        })
        return res.status(200).json({
            message: `Materials has been retrivied`,
            data: allMaterials
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Update */
const updateMaterials = async (req: Request, res: Response) : Promise<any> =>  {
    try {
        
        const id = req.params.id

        const findMaterials = await prisma.materials
            .findFirst({
                where: {id: Number(id)}
            })
        
        if(!findMaterials){
            return res.status(200)
            .json({
                message: `Materials is not found`
            })
        }

        const {
            materials_name,materials_price, materials_type
        } = req.body

       const saveMaterials = await prisma.materials
            .update({
                where: {id: Number(id)},
                data: {
                    materials_name: materials_name ? materials_name: findMaterials.materials_name,
                    materials_price: materials_price ? Number(materials_price) : findMaterials.materials_price,
                    materials_type: materials_type ? materials_type : findMaterials.materials_type
                }
            })

            return res.status(200)
                .json({
                    message: `Materials has been updated`,
                    data: saveMaterials
                })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteMaterials = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const id = req.params.id

        const findMaterials = await prisma.materials
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findMaterials){
            return res.status(200)
            .json({
                message: `Materials is not found`
            })
        }

    
        const saveMaterials= await prisma.materials
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `Materials has been removed`,
                data: saveMaterials
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

export {createMaterials, readMaterials, updateMaterials, deleteMaterials}

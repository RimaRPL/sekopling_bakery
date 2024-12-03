import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import { number } from "joi";

const prisma = new PrismaClient({errorFormat:"minimal"})

/** CREAT */
const createSuppliers = async (req: Request, res: Response) : Promise<any> =>{
    try {
        const suppliers_name = req.body.suppliers_name
        const suppliers_address = req.body.suppliers_address
        const suppliers_phone = req.body.suppliers_phone

        const newSuppliers = await prisma.suppliers.create({
            data: {
                suppliers_name,suppliers_address,suppliers_phone
            }
        })

        return res.status(200)
        .json ({
            message: `New Suppliers has been created`,
            data: newSuppliers
        })
    } catch (error) {
        return res.status(500)
        .json(error)
    }
}

/** Read */
const readSuppliers = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const search = req.query.search
        const allSuppliers = await prisma.suppliers.findMany({
            where:{
                OR:[{
                    suppliers_name: {
                        contains: search?.toString() || ""
                    }
                }]
            }
        })
        return res.status(200).json({
            message: `Suppiers has been retrivied`,
            data: allSuppliers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

/** Update */
const updateSuppliers= async (req: Request, res: Response) : Promise<any> =>  {
    try {
        
        const id = req.params.id

        const findSuppliers = await prisma.suppliers
            .findFirst({
                where: {id: Number(id)}
            })
        
        if(!findSuppliers){
            return res.status(200)
            .json({
                message: `Suppliers is not found`
            })
        }

        const {
            suppliers_name,suppliers_address,suppliers_phone
        } = req.body

       const saveSuppliers = await prisma.suppliers
            .update({
                where: {id: Number(id)},
                data: {
                    suppliers_name : suppliers_name ? suppliers_name : findSuppliers.suppliers_name,
                    suppliers_address : suppliers_address ? suppliers_address : findSuppliers.suppliers_address,
                    suppliers_phone : suppliers_phone ? suppliers_phone : findSuppliers.suppliers_phone
                }
            })

            return res.status(200)
                .json({
                    message: `Suppliers has been updated`,
                    data: saveSuppliers
                })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteSuppliers = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const id = req.params.id

        const findSuppliers = await prisma.suppliers
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findSuppliers){
            return res.status(200)
            .json({
                message: `Suppliers is not found`
            })
        }

    
        const saveSuppliers= await prisma.suppliers
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `Suppliers has been removed`,
                data: saveSuppliers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

export { createSuppliers, readSuppliers, updateSuppliers, deleteSuppliers}
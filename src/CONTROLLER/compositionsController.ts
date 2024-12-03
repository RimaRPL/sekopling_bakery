import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "minimal" })


/** Create */
const createComposition = async (req: Request, res: Response): Promise<any> => {
    try {
        const { cakes_id, materials } = req.body;

        // Validate that materials are provided
        if (!materials || materials.length === 0) {
            res.status(400).json({ message: 'Material array cannot empty' });
        }

        // Create compositions for each material
        const compositionData = materials.map((materials: { materials_id: number; qty: number }) => ({
            cakes_id: Number(cakes_id),
            materials_id: Number(materials.materials_id),
            qty: Number(materials.qty),
        }));

        // Insert multiple compositions into the database
        const newComposition = await prisma.compositions.createMany({
            data: compositionData,
        });

        return res.status(201).json({
            message: 'Compositions for the cake has been created',
            data: newComposition,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Unable to create compositions', details: error });
        console.log(error);
        
    }
}

/** Read */
const readComposition = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search
        // get composition
        const allComposition = await prisma.cakes.findMany({
            include: {
                compositions: {
                    include: { materials_detail: true }
                }
            }
        })
        return res.status(200)
            .json({
                message: `Composition retrieved`,
                data: allComposition
            })
    } catch (error) {
        return res.status(500)
            .json({ message: error })
    }
}


/** Update */
const updateComposition = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params //id cake

        const findComposition = await prisma
            .compositions
            .findFirst({
                where: { cakes_id: Number(id) }
            })

        if (!findComposition) {
            return res.status(400)
                .json({ message: `Composition is not found` })
        }

        //read request data
        const cakes_id = id
        const materials: any[] = req.body.materials

        const arrMaterialId = materials.map(item => item.materials_id)

        const findMaterial = await prisma.materials.findMany({
            where: {
                id: { in: arrMaterialId }
            }
        })

        const notFoundMaterial = arrMaterialId.filter(item => !findMaterial.map(materials => materials.id).includes(item))
        if (notFoundMaterial.length > 0) {
            return res.status(200)
                .json({ message: `There a material that not exists` })
        }


        await prisma.compositions
            .deleteMany({
                where: { cakes_id: Number(id) }
            })


        let newDetail = []
        for (let index = 0; index < materials.length; index++) {
            const { materials_id, qty } = materials[index]


            newDetail.push({
                cakes_id: Number(id), materials_id: Number(materials_id), qty: Number(qty)
            })
        }

        const newCompositions = await prisma.compositions.createMany({
            data: newDetail
        })

        return res.status(200)
            .json({
                message: `Composition has been updated`,
                data: newCompositions
            })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json({ message: error })
    }
}

//delete composition 
const deleteComposition = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params

        const findComposition = await prisma.compositions.findFirst({
            where: {
                id: Number(id)
            }
        })

        if (!findComposition) {
            res.status(400)
                .json({
                    message: `Composition is not found`
                })
        }

        await prisma.compositions
            .delete({
                where: {
                    id: Number(id)
                }
            })

        res.status(200)
            .json({ message: `Composition has been removed`})
    } catch (error) {
        res.status(500)
            .json({ error })
    }
}






export { createComposition, readComposition,updateComposition, deleteComposition}
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    errorFormat: `minimal`
})

type SuppliesDetail = {
   materials_id : number,     
   materials_price: number,  
   qty: number
}

const createSupplies = async (req: Request, res: Response) : Promise<any> =>  {
    try {
        const supplier_id = Number(req.body.supplier_id)
        const supply_date: Date = new Date(req.body.supply_date)
        const user_id= Number(req.body.user_id)
        const suppliers_detail: SuppliesDetail[] = req.body.suppliers_detail

        /** checking id materials */
        const arrMaterialsId = suppliers_detail
            .map(item=> item.materials_id)

        const findMaterials = await prisma.materials.findMany({
            where: { 
                id:{in: arrMaterialsId}
            }
        })

        /** cek id materials yang tidak tersedia */

        const notFoundMaterials = arrMaterialsId
            .filter(item=> 
                !findMaterials
                .map(materials => materials.id)
                .includes(item)
            )
            if(notFoundMaterials.length>0){
                return res.status(200)
                .json({
                    message: `There are materials not exists`
                })
            }

            /** save supplies data */
            const newSupplies = await prisma
                .supplies
                .create({
                    data: {
                        supplier_id,
                        supply_date,
                        user_id
                    }
                })
            
            /** prepare data for transaction_detail */
            let newDetail = []
            for (let index = 0; index < suppliers_detail.length; index++) {
                
                const {
                    materials_id,
                    qty
                } = suppliers_detail[index]

                /** find price at each medicine */
                const materialsItem = findMaterials.find(item=> item.id == materials_id)
                /** push data to array */
                newDetail.push({
                    supply_id: newSupplies.id,
                    materials_id,
                    materials_price: materialsItem?.materials_price || 0,
                    qty,
                })
            }
           
            await prisma.detail_suppliers
                .createMany({
                    data: newDetail
                })
            
            return res.status(200).json({
                message: `New Supplies has created`,
                data: newSupplies
            })


    } catch (error) {
        console.log(error);
        
        return res.status(500)
            .json(error)
    }
} 

const readSupplies = async (req: Request, res: Response) : Promise<any>  =>  {
    try {

        /** read start date and end date for filtering data */

        const start_date = new Date(
            req.query.start_date?.toString()|| ``
        )
        const end_date = new Date(
            req.query.end_date?.toString()||``
        )

        /** mendapatkan seluruh data transaction sekaligus detail di tiap transaksi */
        let allSupplies = await prisma.supplies.findMany({
            include: {
                detail_suppliers : true,
                suppliers_detail : true,
                user:true

            },
            orderBy: { supply_date: "desc"}
        })

        if(req.query.start_date && req.query.end_date){
            allSupplies = allSupplies
            .filter(trans => 
                trans.supply_date >= start_date
                &&
                trans.supply_date <= end_date
             )
        }
       
        /** 
         * menentukan total harga disetiap transaksi
         */
            allSupplies = allSupplies
            .map(trans => {
                let total = trans. detail_suppliers
                .reduce((jumlah, detail) => 
                    jumlah + (detail.materials_price * detail.qty),
                    0)
                return {
                    ...trans, total
                }
            })

        return res.status(200).json({
            message: `Supplies has been retrieved`,
            data: allSupplies
        })
    } catch (error) {
        console.log(error)

        return res.status(500)
            .json({
                message: error
            })
    }

}

const deleteSupplies = async( req: Request, res: Response) : Promise<any> => {
    try {
        const {id} = req.params

        const findSupplies = await prisma.supplies.findFirst({
            where: { id: Number(id)}
        })

        if(!findSupplies){
            return res.status(400).json({
                message: `Supplies is not found`
            })
        }

        /** hapus detail supplies dulu, krn detail supplies adalah tabel yang tergantung pada tbl supplies */

        await prisma.detail_suppliers.deleteMany({
            where: { supply_id: Number(id)}
        })

        await prisma.supplies.delete({
            where: {id: Number(id)}

        })

        return res.status(200).json({
            message: `Supplies telah dihapus`
        })

    } catch (error) {
        return res.status(500)
            .json(error)
    }
}



export { createSupplies, readSupplies, deleteSupplies }
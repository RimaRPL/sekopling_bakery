import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    errorFormat: `minimal`
})

type OrdersDetail = {
    cakes_id: number,
    qty: number
}

type StatusType = "Process" | "Deliverer" 

const createOrders = async (req: Request, res: Response)  : Promise<any>  => {
    try {
        /** read a request data */
        const user_id = Number(req.body.user_id)
        const order_date: Date = new Date(req.body.order_date)
        const status: StatusType = req.body.status
        const detail_orders: OrdersDetail[] = req.body.detail_orders

        /** checking cakes
         * (memastikan id kue tersedia)
        */
       /** kumpulin id cakes yang dikirimkan */
       const arrCakesId = detail_orders
            .map(item=> item.cakes_id)

        /** check cakes id at medicine table */
        const findCakes = await prisma
            .cakes.findMany({ 
                where: {
                    id:{in: arrCakesId}
                }
            })

        /** cek id obat yang tidak tersedia */
        const notFoundCakes= arrCakesId
            .filter(item => 
                !findCakes
                .map(cakes => cakes.id)
                .includes(item)
            )
            if(notFoundCakes.length>0){
                return res.status(200)
                .json({
                    message: `There are cakes not exists `
                })
            }

            /** save order data */
            const newOrders = await prisma
                .orders
                .create({
                    data: {
                        user_id,
                        order_date,
                        status
                    }
                })
            
            /** prepare data for Detail_orders */
            let newDetail = []
            for (let index = 0; index < detail_orders.length; index++) {
                
                const {
                    cakes_id,
                    qty
                } = detail_orders[index]

                /** find price at each cakes */
                const cakesItem = findCakes.find(item=> item.id == cakes_id)
                /** push data to array */
                newDetail.push({
                    order_id: newOrders.id,
                    cakes_id,
                    qty,
                    cake_price: cakesItem?.cakes_price || 0
                })
            }

            /** save detail order */
            await prisma.detail_orders
                .createMany({
                    data: newDetail
                })
            
            return res.status(200).json({
                message: `New orders has created`
            })


    } catch (error) {
        console.log(error);
        
        return res.status(500)
            .json(error)
    }

}

const readOrders = async (req: Request, res: Response) : Promise<any>  =>  {
    try {

        /** read start date and end date for filtering data */

        const start_date = new Date(
            req.query.start_date?.toString()|| ``
        )
        const end_date = new Date(
            req.query.end_date?.toString()||``
        )

        /** mendapatkan seluruh data orders sekaligus detail di tiap orders */
        let allOrders = await prisma.orders.findMany({
            include: { detail_orders: {
                include: {cakes_details: true}
            }},
            orderBy: { order_date: "desc"}
        })

        if(req.query.start_date && req.query.end_date){
            allOrders = allOrders
            .filter(trans => 
                trans.order_date >= start_date
                &&
                trans.order_date <= end_date
             )
        }
       
        /** 
         * menentukan total harga disetiap orders
         */
            allOrders = allOrders
            .map(trans => {
                let total = trans. detail_orders
                .reduce((jumlah, detail) => 
                    jumlah + (detail.cake_price * detail.qty),
                    0)
                return {
                    ...trans, total
                }
            })

        return res.status(200).json({
            message: `Order has been retrieved`,
            data: allOrders
        })
    } catch (error) {
        console.log(error)

        return res.status(500)
            .json({
                message: error
            })
    }

}

const deleteOrders = async( req: Request, res: Response) : Promise<any> => {
    try {
        const {id} = req.params

        const findOrders = await prisma.orders.findFirst({
            where: { id: Number(id)}
        })

        if(!findOrders){
            return res.status(400).json({
                message: `Orders is not found`
            })
        }

        /** hapus detail orders dulu, krn detail orders adalah tabel yang tergantung pada tbl orders */

        await prisma.detail_orders.deleteMany({
            where: { order_id: Number(id)}
        })

        await prisma.orders.delete({
            where: {id: Number(id)}
        })

        return res.status(200).json({
            message: `Orders telah dihapus`
        })

    } catch (error) {
        return res.status(500)
            .json(error)
    }
}

const updateOrders = async (req: Request, res: Response) : Promise<any> => {
    try {

        /** read id orders from req.params */
        const {id} = req.params

        /** check that orders exists based on id */
        const findOrders= await prisma
            .orders
            .findFirst({
                where: { id: Number(id)},
                include: {detail_orders: true}
            })

        if(!findOrders){
            return res.status(400)
            .json({
                message: `Orders is not found`
            })
        }
    
        /** read a request data */
        const user_id = Number(req.body.user_id) || findOrders.user_id
        const order_date: Date = new Date(req.body.order_date || findOrders.order_date)
        const status : StatusType = req.body.status || findOrders.status
        const detail_orders: OrdersDetail[] = req.body.detail_orders || findOrders.detail_orders 

        /** empty file orders based on orders id */
        await prisma.detail_orders
        .deleteMany({
            where: { order_id: Number(id)}
        })

        /** checking cakes
         * (memastikan id kue tersedia)
        */

       /** kumpulin id kue yang dikirimkan */
       const arrCakesId = detail_orders
            .map(item=> item.cakes_id)

        /** check cakes id at cakes table */
        const findCakes = await prisma
            .cakes.findMany({ 
                where: {
                    id:{in: arrCakesId}
                }
            })

        /** cek id kue yang tidak tersedia */
        const notFoundCakes = arrCakesId
            .filter(item => 
                !findCakes
                .map(cakes => cakes.id)
                .includes(item)
            )
            if(notFoundCakes.length>0){
                return res.status(200)
                .json({
                    message: `There are cakes not exists `
                })
            }

            /** save orders data */
            const saveOrders = await prisma
                .orders
                .update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        user_id,
                        order_date,
                        status
                    }
                })
            
            /** prepare data for detail_orders */
            let newDetail = []
            for (let index = 0; index < detail_orders.length; index++) {
                
                const {
                    cakes_id,
                    qty
                } = detail_orders[index]

                /** find price at each cakes */
                const cakesItem = findCakes.find(item=> item.id == cakes_id)
                /** push data to array */
                newDetail.push({
                    order_id: saveOrders.id,
                    cakes_id,
                    qty,
                    cake_price: cakesItem?.cakes_price || 0
                })
            }

            /** save transaction detail */
            await prisma.detail_orders
                .createMany({
                    data: newDetail
                })
            
            return res.status(200).json({
                message: ` Orders has  been updated`
            })


    } catch (error) {
        console.log(error);
        
        return res.status(500)
            .json(error)
    }
}

export { createOrders, readOrders, deleteOrders, updateOrders}
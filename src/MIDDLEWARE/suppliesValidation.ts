import { NextFunction, Request, Response } from "express"
import Joi from "joi"

const detailSchema = Joi.object({
    materials_id: Joi.number().required(),
    materials_price: Joi.number().min(1).required(),
    qty: Joi.number().required().min(1)
})

const createSchema = Joi.object({
    supplier_id: Joi.number().required(),
    supply_date: Joi.date().required(),
    user_id: Joi.number().required(),
    suppliers_detail: Joi
    .array()
    .items(detailSchema)
    .min(1)
    .required()
})

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction

) : any => {
    const validation = createSchema.validate(req.body)
    if(validation.error){
    
        return res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        })
    }
    return next()
}

export {createValidation}

import { NextFunction, Request, Response } from "express"
import Joi from "joi"

const detailSchema = Joi.object({
    cakes_id: Joi.number().required(),
    qty: Joi.number().required().min(1)
})

const createSchema = Joi.object({
    status: Joi.string().valid("Process","Deliverer").required(),
    order_date: Joi.date().required(),
    user_id: Joi.number().required(),
    detail_orders: Joi
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

const updateSchema = Joi.object({
    status: Joi.string().valid("Process","Deliverer").optional(),
    order_date: Joi.date().optional(),
    user_id: Joi.number().optional(),
    detail_orders: Joi
    .array()
    .items(detailSchema)
    .min(1)
    .optional()
})

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction

) : any => {
    const validation = updateSchema.validate(req.body)
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

export { createValidation, updateValidation }
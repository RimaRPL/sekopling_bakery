import { NextFunction, Request, Response } from "express";
import Joi from "joi"
import { promises } from "dns"


const createSchema = Joi.object({
    cakes_id: Joi.number().required(),
    materials: Joi.array().items(
        Joi.object({
            materials_id: Joi.number().required(),
            qty: Joi.number().required()

        })
    ).min(1).required()
})

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction

): any => {
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

    materials: Joi.array().items(
        Joi.object({
            materials_id: Joi.number().optional(),
            qty: Joi.number().optional()

        })
    ).min(1).required()
})

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction

): any => { 
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
export {createValidation, updateValidation}
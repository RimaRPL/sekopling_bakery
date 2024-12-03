import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import {promises} from "dns"


const createSchema = Joi.object({
    suppliers_name: Joi.string().required(),
    suppliers_address: Joi.string().required(),
    suppliers_phone: Joi.string().required()

})

const createValidation = async (
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any>   => {
    const validation = createSchema.validate(req.body)
    if(validation.error){
        res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        })
    }
    next()
}

const updateSchema = Joi.object({
    suppliers_name: Joi.string().optional(),
    suppliers_address: Joi.string().optional(),
    suppliers_phone: Joi.string().optional()
})

const updateValidation =  async(
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any>  => {
    const validation = updateSchema.validate(req.body)
    if(validation.error){
        res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        })
    }
    next()
}

export {createValidation, updateValidation}
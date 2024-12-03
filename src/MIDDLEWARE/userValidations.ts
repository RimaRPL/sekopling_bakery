import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import {promises} from "dns"

const createSchema = Joi.object({
    user_name: Joi.string().required(),
    user_email: Joi.string().required(),
    user_password: Joi.string().required(),
    user_role: Joi.string().valid("Admin","Cashier").required()
})

const createValidation = async(
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any> => {
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
    user_name: Joi.string().optional(),
    user_email: Joi.string().optional(),
    user_password: Joi.string().optional(),
    user_role: Joi.string().valid("Admin","Cashier").optional()    

})


const updateValidation = async(
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<any> => {
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

const authSchema = Joi.object({
    user_email: Joi.string().email().required(),
    user_password: Joi.string().required()
})

const authValidation = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    const validation = authSchema.validate(req.body)
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
export {createValidation, updateValidation, authValidation}
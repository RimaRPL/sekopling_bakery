import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import { promises } from "dns"

const createSchema = Joi.object({
    materials_name: Joi.string().required(),
    materials_price: Joi.number().min(1).required(),
    materials_type: Joi.string().valid("Powder","Liquid", "Solid").required()
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
    materials_name: Joi.string().optional(),
    materials_price: Joi.number().min(1).optional(),
    materials_type: Joi.string().valid("Powder","Liquid", "Solid").optional()

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
export {createValidation, updateValidation}
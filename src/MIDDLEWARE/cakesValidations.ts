import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import path from "path"
import { ROOT_DIRECTORY } from "../config"
import fs from "fs"
import {promises} from "dns"


const createSchema = Joi.object({
    cakes_name: Joi.string().required(),
    cakes_price: Joi.number().min(1).required(),
    best_before: Joi.date().required(),
    cakes_flavor: Joi.string().required()
    
})

const createValidation = async (
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any>   => {
    const validation = createSchema.validate(req.body)
    if(validation.error){
        /** delete current uploaded file */
        let fileName: string = req.file?.filename || ``
        let pathfile: string = path.join(ROOT_DIRECTORY, "public","cakes-photo",fileName) 
        
        let fileExists = fs.existsSync(pathfile)

        if (fileExists && fileName !== ``){
            fs.unlinkSync(pathfile)
        }
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
    cakes_name: Joi.string().optional(),
    cakes_price: Joi.number().min(1).optional(),
    best_before: Joi.date().optional(),
    cakes_flavor: Joi.string().optional()
})

const updateValidation =  async(
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any>  => {
    const validation = updateSchema.validate(req.body)
    if(validation.error){
        /** delete current uploaded file */
        let fileName: string = req.file?.filename || ``
        let pathfile: string = path.join(ROOT_DIRECTORY, "public","cakes-photo",fileName) 
            
        let fileExists = fs.existsSync(pathfile)
    
        if (fileExists && fileName !== ``){
           fs.unlinkSync(pathfile)
        }
        
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
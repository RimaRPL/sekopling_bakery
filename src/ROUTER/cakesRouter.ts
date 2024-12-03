import { Router } from "express";
import { verifyToken } from "../MIDDLEWARE/authorzation";
import { createValidation, updateValidation } from "../MIDDLEWARE/cakesValidations";
import { createCakes, deleteCakes, readCakes, updateCakes } from "../CONTROLLER/cakesController";
import { uploadCakesPhoto } from "../MIDDLEWARE/uploadCakesPhoto";

const router = Router()

router.post(`/`, [verifyToken,uploadCakesPhoto.single(`image`), createValidation], createCakes )

router.get(`/`, readCakes)

router.put(`/:id`, [uploadCakesPhoto.single(`image`),updateValidation], updateCakes)

router.delete(`/:id`, deleteCakes)

export default router
import { Router } from "express";
import { createComposition, deleteComposition, readComposition, updateComposition} from "../CONTROLLER/compositionsController";
import { createValidation, updateValidation } from "../MIDDLEWARE/compositionsValidations";


const router = Router ()
router.post(`/`,[createValidation], createComposition)
router.get(`/`, readComposition)
router.put(`/:id`,[updateValidation], updateComposition)
router.delete(`/:id`,deleteComposition)

export default router
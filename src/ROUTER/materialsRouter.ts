import {Router} from "express"
import { createValidation } from "../MIDDLEWARE/materialsValidations"
import { createMaterials, deleteMaterials, readMaterials, updateMaterials } from "../CONTROLLER/materialsController"

const router = Router()
//create
router.post(`/`, [createValidation], createMaterials)
router.get(`/`,readMaterials)
router.put(`/:id`, [updateMaterials], updateMaterials)
router.delete(`/:id`, deleteMaterials)
export default router
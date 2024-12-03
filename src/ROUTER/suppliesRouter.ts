import {Router} from "express" 
import { createSupplies, deleteSupplies, readSupplies } from "../CONTROLLER/suppliesController"
import { createValidation } from "../MIDDLEWARE/suppliesValidation"
const router = Router()

router.post(`/`, [createValidation],createSupplies)
router.get(`/`, readSupplies)
router.delete(`/:id`, deleteSupplies)

export default router
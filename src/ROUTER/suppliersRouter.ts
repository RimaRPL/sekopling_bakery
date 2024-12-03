import {Router} from "express"
import { createValidation, updateValidation } from "../MIDDLEWARE/suppliersValidations"
import { createSuppliers, deleteSuppliers, readSuppliers, updateSuppliers } from "../CONTROLLER/suppliersController"

const router = Router()
//create
router.post(`/`, [createValidation], createSuppliers)
//Read
router.get(`/`, readSuppliers)
//update
router.put(`/:id`, [updateValidation], updateSuppliers)
//delete
router.delete(`/:id`, deleteSuppliers)
export default router
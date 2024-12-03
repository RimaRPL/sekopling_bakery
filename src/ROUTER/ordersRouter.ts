import { Router } from "express";
import { createOrders, readOrders, deleteOrders, updateOrders } from "../CONTROLLER/ordersController";
import { createValidation, updateValidation } from "../MIDDLEWARE/ordersValidation";

const router = Router()

router.post(`/`, [createValidation], createOrders)
router.get(`/`, readOrders)
router.put(`/:id`, [updateValidation], updateOrders)
router.delete(`/:id`, deleteOrders)

export default router
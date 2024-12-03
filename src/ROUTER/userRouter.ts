import { Router } from "express";
import { authValidation, createValidation, updateValidation } from "../MIDDLEWARE/userValidations";
import {  authentication, createUsers, deleteUsers, readUsers, updateUsers } from "../CONTROLLER/userController";

const router = Router()

router.post(`/`, [createValidation], createUsers)

router.get(`/`, readUsers)

router.put(`/:id`,[updateValidation], updateUsers)

router.delete(`/:id`, deleteUsers)

router.post(`/auth`, [authValidation], authentication )

export default router
import express, { Router } from "express"
import { generatePatient } from "../controllers"
import { filter } from "../controllers"

const BASE_ROUTE: string = '/doctor'
const router: Router = express.Router()

router.post('/:doctorId/new', generatePatient)
router.post('/', filter)

export default { BASE_ROUTE, router }

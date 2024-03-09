import express, { Router } from "express"
import { filter, refresh, generatePatient } from "../controllers"

const BASE_ROUTE: string = '/doctor'
const router: Router = express.Router()

router.post('/new', generatePatient)
router.post('/', filter)
router.post('/refresh', refresh)

export default { BASE_ROUTE, router }

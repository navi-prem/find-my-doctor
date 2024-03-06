import express, { Router } from "express"
import { signIn, createAdmin } from "../controllers"

const BASE_ROUTE: string = '/admin'
const router: Router = express.Router()

router.post('/sign-in', signIn)
router.post('/sign-up', createAdmin)

export default { BASE_ROUTE, router }

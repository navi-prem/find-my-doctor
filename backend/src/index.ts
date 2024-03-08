import express, { Express, Response } from "express"
import dotenv from "dotenv"
import { Admin, Doctor } from "./routes"
import cookieParser from 'cookie-parser';

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use(Admin.BASE_ROUTE, Admin.router)
app.use(Doctor.BASE_ROUTE, Doctor.router)

app.get("/gg", (_, res: Response) => {
    res.send("Yahallo !!!")
})

app.listen(port, () => {
   console.log(`[server]: http://localhost:${port}`)
})

export default app

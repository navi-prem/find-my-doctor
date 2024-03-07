import { Request, Response } from "express"
import { pool } from "../../db/db"
import { Admin } from "../queries"
import bcrypt from "bcryptjs"

export const signIn = async (req: Request, res: Response) => {
    let status = 401
    let msg = "Admin not authorized."
    const { uid, pass } = req.body
    if (uid === undefined || pass === undefined) return res.status(status).send(msg)

    const client = await pool.connect()

    try {
        const { rows } = await client.query(Admin.getAdmin, [uid])

        if (await bcrypt.compare(pass, rows[0].pass)) {
            // Sign In Logic goes here ... Tbd later on
            status = 200
            msg = "Admin signed in successfully"
        }
    } catch (err) {
        console.log(err)
        status = 500
        msg = "Internal Server Error."
    } finally {
        client.release()
        return res.status(status).send(msg)
    }
}

export const createAdmin = async (req: Request, res: Response) => {
    const { uid, pass } = req.body
    if (!uid || !pass) return res.status(401).send("Admin not authorized.")

    const client = await pool.connect()

    try {
        const hash = await bcrypt.hash(pass, 10)
        await client.query(Admin.createAdmin, [uid, hash])
        client.release()

    } catch (err) {
        console.log(err)
        client.release()
        return res.status(500).send("Internal Server Error.")
    } 

    return res.send("Admin created successfully.")
}

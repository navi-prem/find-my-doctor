import { Request, Response } from "express"
import { pool } from "../../db/db"
import { Admin } from "../queries"
import bcrypt from "bcryptjs"

export const signIn = async (req: Request, res: Response) => {
    const { uid, pass } = req.body
    if (!uid || !pass) return res.status(401).send("Admin not authorized.")

    const client = await pool.connect()

    try {
        const { rows } = await client.query(Admin.getAdmin, [uid])
        client.release()

        if (await bcrypt.compare(pass, rows[0].pass)) {
            // Sign In Logic goes here ... Tbd later on
            return res.status(200).send("Admin signed in successfully")
        } else return res.status(401).send("Admin not authorized.")
    } catch (err) {
        client.release()
        return res.status(500).send("Internal Server Error.")
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

import { Request, Response } from "express"
import { pool } from "../../db/db"
import { Doctor } from "../queries"
import { getDistance } from "geolib"
// import { begin, commit, rollback } from "../queries"

// export const g = async (req: Request, res: Response) => {
//     const client = await pool.connect()
//     try {
//         await client.query(begin)
// 
//         await client.query(commit)
//         client.release()
//     } catch (e) {
//         await client.query(rollback)
//         client.release()
//     } 
//     req
//     res
// }

export const generatePatient = async (req: Request, res: Response) => {
    const client = await pool.connect()
    try {
        const data = await client.query(Doctor.generatePatient, [req.params.doctorId, new Date(Date.now())])
        console.log(data)
        client.release()
    } catch (err) {
        client.release()
    }
}

export const filter = async (req: Request, res: Response) => {
    const { latitude, longitude, dist } = req.body
    if (latitude === undefined || longitude === undefined || dist === undefined) return res.send("Invalid params.").status(400)

    const client = await pool.connect()

    let rows
    try {
        let result = await client.query(Doctor.getHospitals)
        rows = result.rows.filter((h: any) => {
            const distInMeters = getDistance({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, { latitude: h.latitude, longitude: h.longitude })
            const distInKms = distInMeters / 1000
            return distInKms <= parseFloat(dist)
        })
        rows = rows.map(r => r.hospital_id)
        console.log(rows)
    } catch (err) {
        client.release()
        return res.send("Internal Server Error.").status(500)
    }
    try {
        const { rows: doctors } = await client.query(Doctor.getNearbyDoctors, [rows])
        client.release()
        return res.json(doctors).status(200)
    } catch (err) {
        console.log(err)
        client.release()
        return res.send("Internal Server Error.").status(500)
    }
}

import { Request, Response } from "express"
import { pool } from "../../db/db"
import { Doctor } from "../queries"
import { getDistance } from "geolib"
import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()

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

function timeToMinutes(timeString: string) {
    let hours = 0;
    let minutes = 0;

    const parts = timeString.split(" ");
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "hour" || parts[i] === "hours") {
            hours = parseInt(parts[i - 1], 10) || 0;
        } else if (parts[i] === "min" || parts[i] === "mins") {
            minutes = parseInt(parts[i - 1], 10) || 0;
        }
    }

    const totalMinutes = (hours * 60) + minutes;
    return totalMinutes;
}

export const filter = async (req: Request, res: Response) => {
    let status = 400
    let msg: string | any[] = "Invalid params."
    const { latitude, longitude, dist } = req.body
    if (latitude === undefined || longitude === undefined || dist === undefined) return res.send(msg).status(status)

    const client = await pool.connect()

    let rows
    let hospitalIds: any = []
    try {
        let result = await client.query(Doctor.getHospitals)
        rows = result.rows.filter((h: any) => {
            const distInMeters = getDistance({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, { latitude: h.latitude, longitude: h.longitude })
            const distInKms = distInMeters / 1000
            if (distInKms <= parseFloat(dist)) hospitalIds = [...hospitalIds, h.hospital_id]
            return distInKms <= parseFloat(dist)
        })
    } catch (err) {
        client.release()
        return res.send("Internal Server Error.").status(500)
    }
    try {
        let { rows: doctors } = await client.query(Doctor.getNearbyDoctors, [hospitalIds])
        const destinations = encodeURIComponent(doctors.map(destination => {
            return destination.latitude + ',' + destination.longitude
        }).join('|'))
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${encodeURIComponent(latitude + ',' + longitude)}&key=${process.env.API_KEY}`)
        const arr = data.rows[0].elements.map((e: any) => e.status === 'OK' ? e.duration.text : '-1 mins')
        doctors = doctors.map((x, i) => ({ ...x, time: timeToMinutes(arr[i]) }))

        status = 200
        msg = doctors
    } catch (err) {
        console.log(err)
    } finally {
        client.release()
        if (status === 200) return res.json(msg).status(status)
        return res.send("Internal Server Error.").status(500)
    }
}

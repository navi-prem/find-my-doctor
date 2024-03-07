export const Doctor = {
    generatePatient: "insert into patient (doctor_id, arrived_at) values ($1, $2);",
    updateToken: "",
    getHospitals: "select * from hospital;",
    getNearbyDoctors: "SELECT d.image_url, h.name as hospital_name, d.name as doctor_name, d.doctor_id, d.specialization, d.rating, d.avg_wait_time, h.latitude AS latitude, h.longitude AS longitude, (SELECT COUNT(*) FROM patient p WHERE p.doctor_id = d.doctor_id AND p.consulted_at IS NULL) AS pending_patients_count FROM doctor d JOIN hospital h ON d.hospital_id = h.hospital_id WHERE h.hospital_id IN (SELECT unnest($1::uuid[]));"
}

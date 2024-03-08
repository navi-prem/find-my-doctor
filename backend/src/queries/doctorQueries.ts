export const Doctor = {
    generatePatient: "insert into patient (doctor_id, arrived_at) values ($1, $2);",
    updateToken: "",
    getHospitals: "select * from hospital;",
    getNearbyDoctors: "SELECT d.image_url, h.name as hospital_name, d.name as doctor_name, d.doctor_id, d.specialization, d.rating, d.avg_wait_time, h.latitude AS latitude, h.longitude AS longitude, (SELECT COUNT(*) FROM patient p WHERE p.doctor_id = d.doctor_id AND p.consulted_at IS NULL) AS pending_patients_count FROM doctor d JOIN hospital h ON d.hospital_id = h.hospital_id WHERE h.hospital_id IN (SELECT unnest($1::uuid[]));",
    getCountData:  "SELECT doctor_id, '0' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[]))  AND arrived_at >= NOW() - INTERVAL '1 day' GROUP BY doctor_id UNION ALL SELECT doctor_id, '1' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '2 days' GROUP BY doctor_id UNION ALL SELECT doctor_id, '2' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '3 days' GROUP BY doctor_id UNION ALL SELECT doctor_id, '3' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '4 days' GROUP BY doctor_id UNION ALL SELECT doctor_id, '4' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '5 days' GROUP BY doctor_id UNION ALL SELECT doctor_id, '5' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '6 days' GROUP BY doctor_id UNION ALL SELECT doctor_id, '6' AS time_interval, COUNT(*) AS patient_count FROM patient WHERE doctor_id IN (SELECT unnest($1::uuid[])) AND arrived_at >= NOW() - INTERVAL '7 days' GROUP BY doctor_id;"
}

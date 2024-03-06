export const Doctor = {
    generatePatient: "insert into patient (doctor_id, arrived_at) values ($1, $2);",
    updateToken: "",
    getHospitals: "select * from hospital;",
    getNearbyDoctors: "select * from doctor where hospital_id in (select unnest($1::uuid]))"
}

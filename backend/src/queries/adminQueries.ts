export const Admin = {
    getAdmin: "select * from admin where uid = $1;",
    createAdmin: "insert into admin values ($1, $2);"
}

import { useEffect, useState } from "react"
import { api, getErrorMessage } from "../api/http"

export const AdminUsers = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        api.get('/users')
            .then((res) => setUsers(res.data))
            .catch((err) => alert(getErrorMessage(err, "Could not load users")))
    }, [])

    return <>
        <h3 className="text-center">Users</h3>
        <div className="container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.gender}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

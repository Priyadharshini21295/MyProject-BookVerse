import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MyContext } from '../App'
import { api, getErrorMessage } from '../api/http.js'

export const LoginPage = () => {

    const { loggedUser, setLoggedUser } = useContext(MyContext);

    const [user, setUser] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("");
    const myNavi = useNavigate();

    useEffect(() => {
        if (loggedUser) {
            if (loggedUser.role === "admin")
                myNavi("/admin");
            else if (loggedUser.role === "user")
                myNavi("/user");
        }
    }, [loggedUser])

    function handleChange(e) {
        setUser({
            ...user, [e.target.name]: e.target.value
        })
    }

    async function handleLogin(e) {

        e.preventDefault();

        try {
            // POST, so the password never appears in the URL (the old version used GET /users?username=..&password=..)
            const res = await api.post('/auth/login', user)

            // localStorage "user" now also holds the JWT; http.js sends it on every request
            const session = {
                username: res.data.username,
                role: res.data.role,
                token: res.data.token
            }

            localStorage.setItem("user", JSON.stringify(session))
            setLoggedUser(session)
            setError("")
        }
        catch (err) {
            setError(err.response?.status === 401
                ? "Username or Password is Incorrect"
                : getErrorMessage(err, "Could not log in"))
        }

    }

    return <>
        <Navbar />
        <div className="container">
            <h3 className="text-center">Login</h3>
            <form action="" onSubmit={handleLogin} className="container w-50 border shadow-sm py-5" style={{ maxWidth: "500px" }}>
                <div className="form-group">
                    <input type="text" name="username" onChange={handleChange} value={user.username} className="form-control" placeholder="Username" required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" onChange={handleChange} value={user.password} className="form-control my-2" placeholder="Password" required />
                </div>
                {
                    error && <p className="text-danger">{error}</p>
                }
                <input type="submit" value="Login" className="btn btn-primary" />
                <input type="reset" value="Cancel" className="btn btn-warning mx-2" />
            </form>
        </div>
    </>
}

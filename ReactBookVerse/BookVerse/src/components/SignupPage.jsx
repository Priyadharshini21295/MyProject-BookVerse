import { useContext, useEffect, useState } from "react"
import { Navbar } from "./Navbar"
import { MyContext } from "../App"
import { useNavigate } from "react-router-dom"
import { api } from "../api/http"
import * as Yup from 'yup'


const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = Yup.object({
    username: Yup.string().min(5, 'username should be more than 5 characters')
        .required('username is required')
        .test("check-username", "Username already taken",
            async function (value) {
                if (!value) return true; // skip if empty

                const res = await api.get('/auth/username-available', { params: { username: value } });
                return res.data.available; // true = valid, false = error
            }
        ),

    password: Yup.string()
        .required('password is missing')
        .matches(regex, 'password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, one special chaacter'),

    email: Yup.string()
        .required('email is missing')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please enter valid email'),

    phone: Yup.string()
        .matches(/^(\+91)?[6-9]\d{9}$/, 'please enter valid mobile number')
        .required('mobile number is missing')
})


export const SignupPage = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        gender: "",
        phone: "",
        role: 'user',
        address: []
    })

    const { loggedUser, setLoggedUser } = useContext(MyContext);
    const [error, setError] = useState({})
    const myNavi = useNavigate();

    useEffect(() => {
        if (loggedUser) {
            if (loggedUser.role === "admin")
                myNavi("/admin");
            else if (loggedUser.role === "user")
                myNavi("/user");
        }
    }, [loggedUser])

    async function handleBlur(e) {

        const { name, value } = e.target;

        try {
            await validationSchema.validateAt(name, { ...formData, [name]: value });
            setError((prev) => ({ ...prev, [name]: '' })); // clear error for this field
        } catch (err) {
            setError((prev) => ({ ...prev, [name]: err.message })); // set field-specific error
        }
    }


    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Validate formData using Yup
            await validationSchema.validate(formData, { abortEarly: false });
            setError({}); // clear previous errors

            //  Proceed only if validation passes
            const res = await api.post('/auth/register', formData);
            if (res.data) {
                alert('Account created...');
                setFormData({
                    username: "",
                    password: "",
                    email: "",
                    gender: "",
                    phone: "",
                    role: 'user',
                    address: []
                });
                myNavi('/login')
            }
        } catch (err) {
            // ✅ Capture and update error state
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                    console.log(e.path, e.message);
                });
                setError(newErrors);
            } else if (err.response?.data?.message) {
                setError({ username: err.response.data.message });
            }
        }

    }


    return <>
        <Navbar />
        <div className="container mt-5">
            <div className="w-50 mx-auto shadow p-4">
                <h2 className="text-center mb-4">Signup Form</h2>

                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="mb-3">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username}
                            onBlur={handleBlur}
                            onChange={handleChange} className="form-control" required />
                        {error.username && <p className="text-danger">{error.username}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control"
                            value={formData.password}
                            onBlur={handleBlur}
                            onChange={handleChange} required />
                        {error.password && <p className="text-danger">{error.password}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email" name="email" className="form-control"
                            value={formData.email}
                            onBlur={handleBlur}
                            onChange={handleChange} required />
                        {error.email && <p className="text-danger">{error.email}</p>}
                    </div>

                    {/* Gender */}
                    <div className="mb-3">
                        <label>Gender</label>

                        <div>
                            <input type="radio" name="gender" value="male" onChange={handleChange}
                                required /> Male

                            <input type="radio" name="gender" value="female" className="ms-3" onChange={handleChange}
                                required /> Female
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label>Phone</label>
                        <input type="number" name="phone" className="form-control" value={formData.phone}
                            onBlur={handleBlur}
                            onChange={handleChange} required />
                        {error.phone && <p className="text-danger">{error.phone}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Signup
                    </button>

                </form>
            </div>
        </div>

    </>
}
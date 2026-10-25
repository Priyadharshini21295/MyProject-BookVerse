
import { useContext } from "react";
import { MyContext } from "../App";
import { Link, Outlet, useNavigate } from "react-router-dom";


export const AdminDashboard = () => {

    const { setLoggedUser } = useContext(MyContext)
    const myNavi = useNavigate()

    // Access control now lives in <RequireRole> (see App.jsx)

    function logout(){ 
        localStorage.removeItem("user")
        setLoggedUser(null)
        myNavi('/')
    }


    return <>
       <div className="container-fluid p-0">

        {/* <!-- Off canvas for mobile view menu --> */}
        <div id="offcanvas-view">
            <button className="m-2 d-block d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#menu">
                <i className="fa-solid fa-bars"></i>
            </button>

            <div className="offcanvas offcanvas-start bg-dark text-light" id="menu">
                <div className="offcanvas-header">
                    <h3>LOGO</h3>
                    <button className="btn-close bg-light" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        <div className="mt-5">
                        <Link to="/admin" className="nav-link my-3">Home</Link>
                        <Link to="users" className="nav-link my-3">Users</Link>
                        <Link to="orders" className="nav-link my-3">Orders</Link>
                        <button onClick={logout} className="mt-5 btn btn-warning mx-auto">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="row">
            <div className="sidebar col-lg-2 d-none d-lg-block">

                <div className="sidebar-box vh-100 bg-dark text-light p-3">
                    <h2 className="text-center">LOGO</h2>

                    <div className="m-5">
                        <Link to="/admin" className="nav-link my-3">Home</Link>
                        <Link to="users" className="nav-link my-3">Users</Link>
                        <Link to="orders" className="nav-link my-3">Orders</Link>
                        <button onClick={logout} className="mt-5 btn btn-warning mx-auto">Logout</button>
                    </div>
                </div>

            </div>
            <div className="content col-lg-10 vh-100 ">

                <div className="row my-5">
                    <Outlet />  
                </div>

              
            </div>
        </div>
    </div>
    </>
}
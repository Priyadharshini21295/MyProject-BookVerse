import { useContext } from "react";
import { MyContext } from "../App";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CartContext, CartProvider } from "./CartProvider";


export const UserDashboard =()=>{
    const { setLoggedUser } = useContext(MyContext)
    const myNavi = useNavigate()

    const {clearCart} = useContext(CartContext)

    // Access control now lives in <RequireRole> (see App.jsx)

    function logout(){ 
        localStorage.removeItem("user")
        setLoggedUser(null)

        localStorage.removeItem("cart")
        clearCart();
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
                        <Link to="/user" className="nav-link my-3">Home</Link> 
                        <Link to="profile" className="nav-link my-3">Profile</Link>
                        <Link to="cart" className="nav-link my-3">Cart</Link>
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
                        <Link to="/user" className="nav-link my-3">Home</Link> 
                        <Link to="profile" className="nav-link my-3">Profile</Link>
                        <Link to="cart" className="nav-link my-3">Cart</Link>
                        <button onClick={logout} className="mt-5 btn btn-warning mx-auto">Logout</button>
                    </div>
                </div>

            </div>
            <div className="content col-lg-10 vh-100 " style={{overflowY:'auto'}}>

                <div className="row my-5">
                    <Outlet />  
                </div>

              
            </div>
        </div>
    </div>
    </>
}
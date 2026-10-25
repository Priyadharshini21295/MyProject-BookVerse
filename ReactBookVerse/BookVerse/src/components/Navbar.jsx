import { NavLink } from "react-router-dom"


export const Navbar=()=>{
    return<>
    <div className="p-3 d-flex justify-content-between">
        <div id="logo"><h3>LOGO</h3></div>
        <div id="menu">
            <NavLink to="/" className={({isActive})=>isActive? 'btn btn-primary' : 'btn'}>Home</NavLink>
            <NavLink to="/login" className={({isActive})=>isActive? 'btn btn-primary' : 'btn'}>Login</NavLink>
            <NavLink to="/signup" className={({isActive})=>isActive? 'btn btn-primary' : 'btn'}>Signup</NavLink>

        </div>
    </div>
    </>
}
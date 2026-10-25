import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../App";

// Wrap a route to restrict it to one role. Unlike the old useEffect redirects inside
// the dashboards, this decides BEFORE rendering and doesn't move you off the page you
// were on when you refresh (e.g. /admin/edit-book/5).
// This is only a UX guard: the real protection is [Authorize(Roles = ...)] on the API.
export const RequireRole = ({ role, children }) => {
    const { loggedUser } = useContext(MyContext);

    if (!loggedUser) return <Navigate to="/login" replace />;
    if (loggedUser.role !== role)
        return <Navigate to={loggedUser.role === "admin" ? "/admin" : "/user"} replace />;

    return children;
};

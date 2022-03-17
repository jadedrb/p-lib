import { Navigate } from "react-router-dom";

// if there is no user set and if the page is no longer loading
const PrivateRoute = ({ isAuth, loading, children }) => {
    return !isAuth && !loading ? <Navigate to="/home" /> : children;
};

export default PrivateRoute
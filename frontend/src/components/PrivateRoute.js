import { Navigate } from "react-router-dom";

// if there is no user set after setup
const PrivateRoute = ({ isAuth, setup, children }) => {
    console.log(isAuth, setup, !isAuth && setup)
    return isAuth === false && setup ? <Navigate to="/home" /> : children;
};

export default PrivateRoute
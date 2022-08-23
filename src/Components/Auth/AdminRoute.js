import {Navigate} from 'react-router-dom'
function AdminRoute({children}){

    const auth = localStorage.getItem("userInfo") !== null 
                 && JSON.parse(localStorage.getItem("userInfo")).user.role > 0;
    console.log("auth:",auth);
    return auth? children : <Navigate to='/login'/>
}
export default AdminRoute;
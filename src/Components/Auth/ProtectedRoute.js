import {Navigate} from 'react-router-dom'

function ProtectedRoute({children}){
    const auth = localStorage.getItem("userInfo") !== null ? true : false 
    return auth? children : <Navigate to='/login' />
}

export default ProtectedRoute;
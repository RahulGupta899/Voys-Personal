import './App.css';
import DashBoard from './Components/Dashboard/Dashboard.js'
import Login from './Components/Login/Login.js'
import Train from './Components/Train/Train.js'
import NotFound from './Components/Not Found/NotFound';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import AdminRoute from './Components/Auth/AdminRoute.js'
import AllUsers from './Components/Users/AllUsers';
import AddUser from './Components/Users/AddUser';
import UserDetails from './Components/Users/UserDetails';

import {
  Routes,
  Route
} from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<DashBoard/>}>
            <Route index element={<h1>Default Child Route</h1>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/train' 
              element={
                <ProtectedRoute>
                  <Train/>
                </ProtectedRoute>
              }
            />
          <Route path="/addUser" element={<AddUser/>}/>

          <Route path='allUsers' element={<AllUsers/>}/>
          
          <Route path='/admin-dashboard/user/:slug' element={<UserDetails/>}/>

        </Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </>
  );
}

export default App;

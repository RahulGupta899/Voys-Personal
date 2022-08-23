import { Outlet } from "react-router-dom";

function Dashboard(){
    return(
        <div>
            <h3 className=" text-sky-900 font-bold text-3xl border-b-8 py-2 bg-stone-100	">
                MindVoys Navbar
            </h3>
            <div className="m-8">
                <Outlet/>   
            </div>
        </div>
    )
}

export default Dashboard;



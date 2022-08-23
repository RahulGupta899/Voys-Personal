import {Button,message} from 'antd'
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import Swal from 'sweetalert2'

function DeleteUser({id}){

    const navigate = useNavigate();
    const hostType = "http://localhost:8000"

    const handleOnDelete = function(){
        Swal.fire({
            toast: true,
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton:true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor:'#d33',
            confirmButtonText: "Yes, delete it!"
        })
        .then(async function(result){
            console.log(result)
            if(result.isConfirmed){
                const url = `${hostType}/api/user/delete?id=${id}`
                
                const {data} = await axios.delete(url)  
                if(data.success){
                    message.success("Deleted successfully...")
                    navigate('/allUsers')
                }
            }
        })
    }

    return(
        <>
            <Button
                className="bg-red-800 text-white rounded-sm p-2"
                onClick={handleOnDelete}
            >Delete User</Button>
        </>
    )
}
export default DeleteUser;
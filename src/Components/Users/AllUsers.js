import React, {useState,useEffect} from 'react'
import {Col,Row,Table,Input} from 'antd'
import axios from 'axios';
import {Link} from 'react-router-dom'

function AllUsers(){
    
    console.log("Component Rendered")
    const [users, setUsers] = useState([]);
    const [usersBackup,setUsersBackup] = useState([])
    const [loading,setLoading] = useState(false)

    const userId = JSON.parse(localStorage.getItem("userInfo"))["user"]['_id'];
    const token = JSON.parse(localStorage.getItem("userInfo"))["token"];
    
    const {Search} = Input  // Search Tag from Ant design Input

    function onSearch(value){
        setLoading(true)
        console.log("Search Text: "+value)
        value = value.trim().toLowerCase();

        if(value==="" || users.length === 0){
            setUsers(usersBackup)
        }
        else{
            const searchedUser = users.filter(function(user){
                
                const fname = user.firstName.toLowerCase();
                const lname = user.lastName.toLowerCase();
                const fullName = fname+" "+lname;
                const email = user.email.toLowerCase();
    
                return fname.includes(value) || lname.includes(value) || email.includes(value) || fullName.includes(value)
    
            })
            setUsers(searchedUser)
        }
        setLoading(false)
    }

    // Fetching all Users from BACKEND
    useEffect(function(){
        const hostType = 'http://localhost:8000'
        const url = `${hostType}/api/users/${userId}`
        console.log(url)

        async function fetchAllUsers(){
            const {data} = await axios.get(url,{headers:{Authorization:  `Bearer ${token}`}})
            console.log(data)

            setUsers(data);
            setUsersBackup(data);
        }
        fetchAllUsers();
    },[])


    // contents of Table
    const dataSource = []
    users.map(function(user){
        dataSource.push({
            key:user._id,
            name: <Link to={`/admin-dashboard/user/${user._id}`}> {user.firstName +" "+ user.lastName} </Link>,
            email: <Link to={`/admin-dashboard/user/${user._id}`}> {user.email} </Link>
        })
    })

    // Fields of table
    const columns = [
        {
            title:'Name',
            dataIndex: 'name',
            key:'name'
        },
        {
            title:'Email',
            dataIndex: 'email',
            key:'email'
        }
    ]

    return(
        <>
            <h1 className='text-3xl mb-4 '>All Users</h1>
            <Row>
                <Col>
                    <Search
                        className="text-rose-900 p-4"
                        placeholder='Input search Text'
                        allowClear
                        enterButton="search"
                        size="large"
                        onSearch={onSearch}
                        loading={loading}
                    />
                </Col>

                <Col>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </Col>
            </Row>
        </>
    )
}

export default AllUsers;
import React, {useState, useEffect} from 'react'
import {message} from "antd"
import {useFormik, validateYupSchema} from 'formik'
import {TextField,Button,Select,InputLabel,MenuItem} from '@mui/material'
import {useParams} from 'react-router-dom';
import axios from 'axios'


function UpdateUser({ReactStateOPENupdater, userDetail}){
    
    console.log("Component Rerendered...")
    const [user,setUser] = useState(userDetail);
    const [campaigns,setCampaigns] = useState([])
    const [role,setRole] = useState(null)
    const {slug} = useParams();
    const token = JSON.parse(localStorage.getItem("userInfo"))["token"];

    function handleRoleChange(e){
        setRole(e.target.value)
    }

    function handleCampaignChange(e){
        console.log("CAMPAIGN:",e.target.value)
        const {
            target: {value},
        } = e;
        // console.log(value)
        setCampaigns(typeof value === 'string' ? value.split(',') : value)
    }

    
    const formik = useFormik({
        initialValues:{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            campaign: user.campaign
        },
        enableReinitialize: true,
        onSubmit: async function(values){
            const updateData = {
                ...values,
                campaign: campaigns,
                role
            };

            
            const hostType = 'http://localhost:8000'
            const url = `${hostType}/api/user/update?id=${slug}`
            
            const {data} = await axios.put(url,updateData,{headers:{Authorization: `Bearer ${token}`}})
                                        .then(()=> ReactStateOPENupdater(false))
                                        .then(()=> message.success("Successfully updated"))
            console.log(data)
        }       
    })

    useEffect(()=>{
        console.log("Useeffect executed...")
        setRole(userDetail.role)
        setCampaigns(userDetail.campaign)
    },[userDetail])


    console.log("Formik Values")
    console.log(user)
    console.log(formik.values.firstName)

    
    return(
        <>
            <form  className="p-12" onSubmit={formik.handleSubmit}>
                
                <TextField
                    required
                    id="outlined-required"
                    label="First Name"
                    name='firstName'
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                />
                <br/><br/>
                
                <TextField
                    required
                    id="outlined-required"
                    label="Last Name"
                    name='lastName'
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                />
                <br/><br/>

                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    name='email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <br/><br/>

                <Select
                    labelId='demo-simple-select-label'
                    id="demo-simple-select"
                    value={role}
                    onChange={handleRoleChange}
                    label="Role"   
                >
                    <MenuItem value={0}>Quality Analyst</MenuItem>
                    <MenuItem value={1}>Quality Manager</MenuItem>
                    <MenuItem value={2}>Admin</MenuItem>
                    <MenuItem value={3} default>Developer</MenuItem>
                </Select>
                <br/><br/>

                <InputLabel id="demo-simple-select-label">Campaign</InputLabel>
                <Select
                    id="outlined-required"
                    label="Campaign"
                    value={campaigns}
                    onChange={handleCampaignChange}  
                    
                >
                    <MenuItem value="vital">Vital</MenuItem>
                    <MenuItem default value="idealLiving">Ideal Living</MenuItem>
                    <MenuItem value="phs">PHS</MenuItem>
                    <MenuItem value="oyoAzure">OYO Azure</MenuItem>
                    <MenuItem value="clio">Clio</MenuItem>
                    <MenuItem value="kotak">kotak</MenuItem>
                </Select>
                <br/><br/>

                <Button
                    variant='contained'
                    size='medium'
                    type='submit'
                >
                Update</Button>
            
            </form>
        </>
    )
}

export default UpdateUser;
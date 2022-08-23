import React , {useState, useEffect, useRef} from 'react'
import {Typography, Image, Skeleton, Button} from 'antd';
import {useParams} from 'react-router-dom'
import  img from './default_profile_image.jpg'
import UserCard from './UserCard';
import axios from 'axios'
import moment from 'moment'
import {CSVLink} from 'react-csv'
import DeleteUser from './DeleteUser';
import UpdateUser from './UpdateUser';
import {Dialog} from '@mui/material'



function UserDetails(){

    console.log("UserDetails Rendered...")
    const myRef = useRef(null);
    const {Title} = Typography;
    const {slug} = useParams();   // Destructurig the parameter slug(id of candidate) from Url

    const [userDetail, setUserDetail] = useState({});
    const [userTranscriptions, setUserTranscriptions] = useState([]);
    const [open,setOpen] = useState(false)


    const userId = JSON.parse(localStorage.getItem("userInfo"))["user"]["_id"];
    const role = JSON.parse(localStorage.getItem("userInfo"))["user"]["role"];
    const token = JSON.parse(localStorage.getItem("userInfo"))["token"];
    const hostType = 'http://localhost:8000'
    




    //******************* TODAY'S TRANSCRIPTION DURATION ************************************
    const todaysDate = moment().format("DD-MM-YYYY");
    const todaysTranscriptions = userTranscriptions.filter((transcription)=> transcription.date === todaysDate)
    console.log(todaysTranscriptions)

    let todaysTranscriptionDuration = 0;
    todaysTranscriptions.map((transcription)=>{
        todaysTranscriptionDuration += transcription.Duration
    })
    console.log("Todays Transcription duration: "+todaysTranscriptionDuration)

    

    // ****************** TOTAL TRANSCRIPTION DURATION ************************
    //                    Along with different Status Counts
    let totalDuration = 0; 
    let approvedCount = 0;
    let ambigousCount = 0;
    let rejectCount = 0;

    userTranscriptions.forEach((transcription)=>{
        totalDuration += transcription.Duration
        if(transcription.status === "Approved")
            approvedCount++;
        else if(transcription.status === "Rejected")
            rejectCount++;
        else
            ambigousCount++;
    })
    console.log("Total Duration: "+totalDuration)
    console.log("No of Approved Transcriptions: ",approvedCount)
    console.log("No of Ambiguous Transcriptions: ",ambigousCount)
    console.log("No of Rejected Transcriptions: ",rejectCount)
    


    //************************ CSV DETAILS ***************************************

    // main
    const csvParams = {
        filename: "userDetails.csv",
        data: getCSVData()
    }
    
    
    function getCSVData(){

        // Curate unique dates
        const dates = []
        userTranscriptions.map((transcription)=>{
            if(!dates.includes(transcription.date)){
                dates.push(transcription.date)
            }
        })
        console.log("Unique Dates:-")
        console.log(dates)


        // Curate Transcriptions for particular date
        const transDataDatewise = []
        dates.map((date)=>{
            let newObj = {};
            let newArr = [];
            userTranscriptions.map((transcription)=>{
                if(date === transcription.date){
                    newArr.push(transcription)
                    console.log("New Array: ",newArr)
                    newObj[date] = newArr
                }
            })
            transDataDatewise.push(newObj)
        }) 
        console.log("Date wise Trancriptions of the Candidate are")
        console.log(transDataDatewise)


        // CSV DATA
        let csvData = [];
        if(transDataDatewise.length > 0){
            transDataDatewise.map((data)=>{
                
                const mainObj = {}
                mainObj["User"] =
                    Object.keys(userDetail).length > 0 &&
                    userDetail.data.firstName +" "+ userDetail.data.lastName
                
                mainObj["Email"] = 
                    Object.keys(userDetail).length > 0 &&
                    userDetail.data.email

                mainObj["Date"] = Object.keys(data)[0];

                let duration = 0;
                Object.values(data)[0].map((x) => {
                    duration += x.Duration;
                })
                mainObj["Transcription Duration(Hrs)"] = duration / 3600
                
                csvData.push(mainObj)
                })
        }
        console.log(csvData)
        return csvData;
    }






    //*********************CANDIDATE UPDATE INFO FORM ****************************/
    

    // Handling Dialog Box
    function handleClickOpen(){
        setOpen(true)
    }

    function handleClose(){
        // This function will execute, when the admin will click anywhere 
        // outside the Dialog box
        setOpen(false)
    }



    //***************************** USE EFFECT   ************************** */

    useEffect(function(){
        const fetchUserDetails = async function(){

            // Candidate information
            const url = `${hostType}/api/user/${slug}`;
            const {data} = await axios.get(url,{headers:{Authorization: `Bearer ${token}`}})
            console.log("Candidate's Information")
            console.log(data) 
            setUserDetail(data);                                      // STATE MODIFICATION
            

            // Transcriptions Validated By candidate
            const url2 = `${hostType}/api/get-user-transcriptions?userId=${slug}`;
            const transcriptions = await axios.get(url2,{headers:{Authorization: `Bearer ${token}`}})
            console.log("Transcriptions Validated by cadidate")
            console.log(transcriptions.data.data);
            setUserTranscriptions(transcriptions.data.data)            // STATE MODIFICATION
        
        }
        fetchUserDetails();        
    },[])

 

    return(
        <div ref={myRef}>
            <br/>
            <Title className="text-3xl"> User's Details </Title>


            <br/>
            {// EXPORT TO CSV      
                    // Logged in user will not get the option to download it's own csv, update, delete
                !(userId === slug)
                && role === 3 // Has to be developer
                && userDetail.success 
                && (
                    <CSVLink {...csvParams} className="bg-green-200 rounded-sm p-2">Export to CSV</CSVLink>
                )
            }

            <br/><br/>
            {// DELETE CANDIDATE and UPDATE CANDIDATE info
                userId !== slug
                && role === 3
                && userDetail.success 
                ?  ( 
                    <>
                        <DeleteUser id={slug} />
                        <br/><br/>

                        {/* This button is just a kind of event listener for the below Dialog component ,
                            when this update user button is clicked, (state: open) becomes true , by which the Dialog 
                            component below will executed */}                        
                        <Button 
                            className="bg-green-200 rounded-sm p-2"
                            onClick={handleClickOpen}
                        >Update User</Button>

                        <Dialog open={open} onClose={handleClose} >
                            <UpdateUser ReactStateOPENupdater={setOpen} userDetail={userDetail} />
                        </Dialog>


                    </>
                   )
                :  null
            }

            <div className="flex m-24">

                <Image width={200}  src={img} />

                {// Display Candidate data
                    userDetail.success 
                    ? <UserCard 
                        userDetail={userDetail}
                        todaysTranscriptionDuration={todaysTranscriptionDuration}
                        totalDuration = {totalDuration}
                    />
                    : <Skeleton active/>        
                }
            </div>


            {
                // CREATE Charts 
                // 1) Candidate Timeline chart (weekly bar chart graph to know the time invested across days of a week)
                // 2) Candidate Transcription chart (Pie chart : to track the count of how many transcription is approved, rejected by the candidate)
                // 3) Transcription Duration chart  (pie chart : across each category , say approve ( how much time invested))
            }
            
        
        </div>
    )
}
export default UserDetails;


function UserCard({userDetail,todaysTranscriptionDuration,totalDuration}){
    console.log("USER CARD Rendered")
    const fname = userDetail.data.firstName
    const lname = userDetail.data.lastName
    const fullName = capitalizeFirstChar(fname) +" "+ capitalizeFirstChar(lname)
    const email = userDetail.data.email
    const role = getRoleName(userDetail.data.role)
    const camapigns = getCampaigns(userDetail.data.campaign)
    console.log("camapigns: " + camapigns)
    const id = userDetail.data._id


    // **************** HELPER FUNCTIONS *******************
    function capitalizeFirstChar(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function getRoleName(roleId){
        if(roleId === 0 )       return "Quality Analyst"
        else if(roleId === 1)   return "Quality Manager"
        else if(roleId === 2)   return "Admin"
        else                    return "Developer"
    }

    function getCampaigns(campaigns){
        let str = "";
        campaigns.map((camp)=>{
            str = str +", "+camp
        })
        return str.slice(1)
    }
    
    return(
        <div className='leading-7 ml-8 border border-black inline-block p-10'>
            <h1 className="font-semibold"> Name: {fullName}</h1>
            <h1 className="font-semibold"> Email: {email}</h1>
            <h3 className="font-semibold"> Id: {id}</h3>
            <h3 className="font-semibold"> Role: {role} </h3>
            <h3 className="font-semibold"> Campaign: {camapigns}</h3>
            <h3 className="font-semibold"> Today's Transcription Duration: {todaysTranscriptionDuration.toFixed(2)} </h3>
            <h3 className="font-semibold"> Total Transcription Duration:  {totalDuration.toFixed(2)} </h3>
        </div>
    )
}
export default UserCard;
import {useFormik} from 'formik'
import {Row,Col,Space,message} from 'antd'
import {TextField,Button, } from '@mui/material'
import React , {useState,useEffect,useRef} from 'react'
import axios from 'axios'

function Train(){

    const audioRef = useRef();

    const [trans,setTrans] = useState({});
    const [text,setText] = useState("");
    const [playedTimes,setPlayedTimes] = useState(0)
    const [audioUrl,setAudioUrl] = useState("")
    const [fetchTime,setFetchTime] = useState(0);
    const [activeBtn,setActiveBtn] = useState(false);

    // To Identify the user
    const userId = JSON.parse(localStorage.getItem("userInfo"))["user"]["_id"];
    const token = JSON.parse(localStorage.getItem("userInfo"))["token"];

    const fetchTranscription = async function(){
        console.log("----------------------")
        console.log("Fetch transcription executed")
        
        
        let hostType = 'http://localhost:8000'
        let url = `${hostType}/api/get-single-transcription`
        console.log(url)
        
        // GET REQUEST to Backend to Receive new Transcription
        const {data} = await axios.get(url,{headers:{Authorization: `Bearer ${token}`}})
        console.log(data);

        setTrans(data.data);
        setText(data.data.text);
        setPlayedTimes(0)  // setting as 0 because we are counting the played times on this particular track from scratch , as already it has some prev values
        setAudioUrl(data.data.URL);
        setFetchTime(Date.now())

        // Why: Beacuse audio tag doesn't re-renders just by changing the src , it needs to load and play
        if(audioRef.current){
            console.log("Audio Ref:",audioRef)
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play();
        }

        // When the New transcription received , make the options available
        if(data.success){
            setActiveBtn(true)
        }

    }

    // USEEFFECT - MOUNTING 
    useEffect(function(){
        fetchTranscription();
    },[])


    const formik = useFormik({
        initialValues:{
            transcription: text
        },
        enableReinitialize: true,

        // Approve button is linked with this
        onSubmit: async function(values){
            console.log("Submitting This data :",values)
            
            // These values are actually the keys that we want to update in Database for this particular transcription
            const updateData = {
                ...values,
                status:"Approved",
                user: userId,           //(current user from local Storage)
                playedTimes:playedTimes,
                timeInvestedToValidate: (Date.now() - fetchTime) / 1000
                                    //  current ms    accessed time ms
            }
            setActiveBtn(false);
            
            //POST REQUEST to backend to update the Transcription Details
            const hostType='http://localhost:8000'
            const url = `${hostType}/api/update-transcriptions?id=${trans._id}`
            const data = await axios.put(url,updateData,{headers:{Authorization:   `Bearer ${token}`}}).then(()=>message.success("successfully submited.."))
            console.log("Transcription updated in the backend:",data);

            //Call New Transcription
            fetchTranscription();
        }

    });

    async function handleAmbiguous(){
        setActiveBtn(false)

        const updateData = { 
          status: "Ambiguous",
          user: userId,
          playedTime: playedTimes,
          transcription: text,
          timeInvestedToValidate: (Date.now() - fetchTime) / 1000,
        }
        
        //POST REQUEST to backend to update the Transcription Details
        const hostType='http://localhost:8000'
        const url = `${hostType}/api/update-transcriptions?id=${trans._id}`
        const data = await axios.put(url,updateData,{headers:{Authorization:  `Bearer ${token}`}}).then(()=>message.success("successfully submited.."))

        fetchTranscription();
    }

    async function handleReject(){
        setActiveBtn(false)

        const updateData = { 
          status: "Rejected",
          user: userId,
          playedTime: playedTimes,
          transcription: text,
          timeInvestedToValidate: (Date.now() - fetchTime) / 1000,
        }
        
        //POST REQUEST to backend to update the Transcription Details
        const hostType='http://localhost:8000'
        const url = `${hostType}/api/update-transcriptions?id=${trans._id}`
        const data = await axios.put(url,updateData,{headers:{Authorization: `Bearer ${token}`}}).then(()=>message.success("successfully submited.."))

        fetchTranscription();
    }
    
    return(
        <>
        <Row>
            <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 20, offset: 2 }}
                lg={{ span: 20, offset: 2 }}
                xl={{ span: 20, offset: 2 }}
                xxl={{ span: 20, offset: 2 }}
                className="train-form"
            >

                <form onSubmit={formik.handleSubmit} id='tran-form'>
                    <h1 className="text-3xl mb-4">Train Model</h1>
                    <TextField
                        style={{
                            width: "100%"
                        }}
                        label="Transcription"
                        id="outlined-multiline-static"
                        multiline
                        rows={8}
                        name="transcription"
                        value={formik.values.transcription}
                        onChange={formik.handleChange}         // Helpful, no need to make state for this 
                    />
                    <br/><br/>
                    <Space>
                        <Button
                            disabled={!activeBtn}
                            variant="contained"
                            size="medium"
                            color="error"
                            onClick={handleReject}
                        >
                        Reject
                        </Button>

                        <Button
                            disabled={!activeBtn}
                            variant="contained"
                            size="medium"
                            onClick={handleAmbiguous}
                        >
                        Ambiguous
                        </Button>

                        <Button
                            disabled={!activeBtn}
                            variant="contained"
                            size="medium"
                            color="success"
                            type="submit"
                        >
                        Approved
                        </Button>
                    </Space>
                    
                    <br/><br/>
                    <Row>
                        <Col span={16} offset={4}>
                            <br/>
                             <audio 
                                controls
                                id="adi"
                                ref={audioRef}
                                onPlay={()=>{
                                    setPlayedTimes(playedTimes+1);
                                }}
                                >
                                <source src={audioUrl} />
                            </audio>       
                        </Col>
                    </Row>
                </form>
            </Col>
        </Row>
            
        </>
        
    )
}


export default Train;
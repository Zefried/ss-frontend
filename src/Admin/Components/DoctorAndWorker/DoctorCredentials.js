import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const DocCredentials = () => {
  
    let token = customStateMethods.selectStateKey('appState', 'token');
  
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const [pswState, setPswState] = useState(false);
    const [pswData, setPswData] = useState({});

    const [docData, setDocData] = useState(null);
    
    customStateMethods.useClearAlert(setMessages);
    
    const {id} = useParams();

    useEffect(()=>{
        try{

            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(response => {
                axios.get(`/api/admin/doctors/fetch-doctorCred/${id}`, {
                  headers:{
                    Authorization:`Bearer ${token}`
                  }
                })
                  .then((res) => {
                       
                       if(res.data.status === 200){
                        setDocData(res.data.data);
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                       }else{
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                        setLoading(false);
                       }
                       setLoading(false);
                  })
            });
        }catch(error){
            setLoading(false);
            console.log(error);
        }

    },[pswState])

    function handleNewPsw (e) {
      setPswData({...pswData, [e.target.name]: e.target.value});
    }

    // handling new password submissions
    const handlePasswordSubmit = () => {
      try{

        setLoading(customStateMethods.spinnerDiv(true));

        axios.get('sanctum/csrf-cookie').then(response => {
            axios.post(`/api/admin/doctors/change-doctorPsw/${id}`, pswData, {
              headers: { 'Content-Type': 'application/json',
                Authorization:`Bearer ${token}`
              }
            })
              .then((res) => {
                   if(res.data.status === 200){
                    setMessages(customStateMethods.getAlertDiv(res.data.message))
                   }else{
                    setMessages(customStateMethods.getAlertDiv(res.data.message))
                    setLoading(false);
                   }
              })
        });

    }catch(error){
        setLoading(false);
        console.log(error);
    }
      setPswState(false); // Reset state to false after submission
    };

    
    const docCard = docData ? (
      <div className="d-flex justify-content-center">
        <div className="card mt-3 shadow-sm" style={{ width: "500px" }}>
          <div className="card-body text-center">
            <h5 className="card-title"><span>Name: </span>{docData.name}</h5>
            <p className="card-text"><strong>Email:</strong> {docData.email}</p>
            <p className="card-text"><strong>Password:</strong> {docData.pswCred}</p>
            <div className="d-flex justify-content-center mt-5">
              <button className="btn btn-outline-danger btn-sm" onClick={() => setPswState(prevState => !prevState)} >Generate New Password</button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
    

    const pswInputField = pswState && (
      <div className="card mb-3 shadow-sm" style={{ width: "500px", margin: "auto" }}>
        <div className="card-body text-center">
          <h5 className="card-title">Enter New Password</h5>
          <input type="text" name='pswCred' className="form-control mb-2" onChange={handleNewPsw} placeholder="New Password" />
          <button className="btn btn-outline-primary" onClick={handlePasswordSubmit}>
            Submit
          </button>
        </div>
      </div>
    );



  return (
    <div>
      {loading}
      {messages}
            <p className="h3 text-center">View User Credentials {docCard}</p>
            {pswInputField}
    </div>
  )
}

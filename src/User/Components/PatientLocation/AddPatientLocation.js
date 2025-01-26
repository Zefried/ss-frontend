import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';


export const AddPatientLocation = () => {


    let token = customStateMethods.selectStateKey('appState', 'token');


    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);


    const [serverResponse, setServerResponse] = useState({
      validation_error:{},
      message:{},
      error:'',
    }); 


    function resetMessages() {
        setTimeout(()=>{
            setMessages(false)
        },3000)

        setTimeout(()=>{
          setServerResponse((prevData)=>(
            {...prevData, error:''}
          ));
        },3000)
    }
  

    const [patientLocation, setPatientLocation] = useState({
        location_name:'', 
    });


    const handleChange = (e) => {

        setPatientLocation((prevItem)=>(
            {...prevItem, [e.target.name]:e.target.value}
        ));

    }


    function handleSubmit(e){
        e.preventDefault();
        setLoading(customStateMethods.spinnerDiv(true));

        try {
        
        axios.get('sanctum/csrf-cookie').then(response => {
            axios.post('api/user/patient-location/add-patient-location', patientLocation, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
            })
            .then((res) => {

                setServerResponse((prevData)=>(
                    {...prevData, 
                    validation_error:res.data.validation_error, 
                    message:res.data.message, 
                    error:res.data.error}
                ))
    
                if(res.data.status !== 200){ 
                    setMessages(customStateMethods.getAlertDiv(res.data.message));  
                } else{
                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                }

                setLoading(false);

                resetMessages();
            })
            .catch(error => {
              //handling catch error 
                setServerResponse((prevData)=>(
                  {...prevData, error:error.message}
                ));

                resetMessages();
            
                setLoading(false);
                console.log(error);  // Handle API error
            });
        });

        } catch (error) {
          //handling catch error 

          setServerResponse((prevData)=>(
            {...prevData, error:error.message}
          ));

          resetMessages();

          console.log(error);  // Handle any unexpected errors
        }
    }


    let mainForm = (
        <div className="container mt-5">
          <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
              <div className="card shadow-lg p-4">
                  <h2 className="card-title text-center mb-4">Add Patient Location</h2>
                  
                  <form>

                  <div className="form-group mb-3 col-lg-5">
                      <label htmlFor="name" className="form-label">Location Name</label>
                      <input
                      type="text"
                      name='location_name'
                      className="form-control"
                      id="location_name"
                      value={patientLocation.location_name}
                      placeholder="Enter Location name"
                      onChange={handleChange}
                      />
                      <span style={{ color: 'orange' }}>
                          {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.location_name : ''}
                      </span>
                    
                  </div>


                  <div className="d-grid gap-2 col-lg-3">
                      <button type="submit" onClick={handleSubmit} className="btn btn-primary btn-md">
                          Add Location
                      </button>
                  </div>
                  </form>
              </div>
              </div>
          </div>
      </div>
    )


  return (
    <div>
        {loading}
        {messages}

        {serverResponse && serverResponse.error && (
          <div class="alert alert-warning" role="alert">
              Your session might have expired please login again!
          </div>
        )}

        {mainForm}

    
    </div>
  )
}

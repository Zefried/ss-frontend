import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';


export const AddPatientRequest = () => {

  let token = customStateMethods.selectStateKey('appState', 'token');

  const [loading, setLoading] = useState(null);
  const [messages, setMessages] = useState(null);
  const [serverResponse, setServerResponse] = useState({
    validation_error:'',
    message:{},
    error:{},
  });


  const [locationData , setLocation] = useState('');

  
  // fetching patient location 

      useEffect(()=>{
        
        try {
 
          setLoading(false);
          axios.get('sanctum/csrf-cookie').then(response => {
            axios.post('api/user/patient-location/fetch-patient-location', {}, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })  
              .then((res) => {
                  clearMessages();
    
                  setServerResponse((prevData)=>(
                    {...prevData, 
                      validation_error:res.data.validation_error, 
                      message:res.data.message, 
                      error:res.data.error}
                  ))
            
      
                  if(res.data.status !== 200){ 
                    setMessages(customStateMethods.getAlertDiv(res.data.message));  
                 
                  } else{
                    setLocation(res.data);

                    console.log(res.data, 'checking patient location');
                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                
                  }
    
                  if(res.data){
                    setLoading(false);
                  }
                 
              })
              .catch(error => {
                setLoading(false);
                console.log(error);  // Handle API error
              });
          });
          
        } catch (error) {
          console.log(error);  // Handling any unexpected errors
        }


      },[])


  // fetching ends here 

  // Step management
  const [step, setStep] = useState(1);

  // Form state to hold all input data
  const [patientData, setPatientData] = useState({
    name: '',
    patient_location_id:'',
    age: '',
    sex: '',
    relativeName: '',  // Father, Mother, or Spouse
    phone: '',
    email: '',
    identityProof: '',
    village: '',
    po: '',
    ps: '',
    pin: '',
    district: '',
    state: '',
  });


  // Proceed to next step
  const nextStep = () => setStep(step + 1);
 
  // Go back to previous step
  const prevStep = () => setStep(step - 1);

   // Function to handle input changes
  const handleChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    });
  };


  function requestPatientRegistration(e) {
    e.preventDefault();

    try {
 
      setLoading(false);
      axios.get('sanctum/csrf-cookie').then(response => {
        axios.post('api/user/patient-crud/add-patient', patientData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then((res) => {
              clearMessages();

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

              if(res.data){
                setLoading(false);
              }
             
          })
          .catch(error => {
            setLoading(false);
            console.log(error);  // Handle API error
          });
      });
      
    } catch (error) {
      console.log(error);  // Handling any unexpected errors
    }
  }

  function clearMessages(){
    setTimeout(()=>{
       setServerResponse('');
    },5500)

  //   setTimeout(()=>{
  //     setMessages('');
  //  },5500)
  }

  function handleSelect(event){
    let location_id = event.target.value;
    setPatientData((prevData)=>(
      {...prevData, patient_location_id:location_id}
    ))
  }
  
  // custom jsx starts from here

  let validationGlobalErrorMsg = '';

  if (serverResponse?.validation_error) {

      const formattedErrors = Object.entries(serverResponse.validation_error)
          .map(([field]) => `${field}`);
    
      validationGlobalErrorMsg = (
          <div className="alert alert-warning mt-4 col-lg-11" role="alert"> 
              <h5>{`There is a validation error. Please check the following fields : ${formattedErrors}`}</h5>
          </div>
      );
  }

 

  let selectLocation = (
    <div className='form-floating mb-3 col-lg-6'> 
      {
      
      locationData?.list_data ? (
        <select className="form-select" aria-label="Select Location" name='patient_location_id' onChange={handleSelect}>
          <option>Select Patient Location</option>

          {locationData.list_data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.location_name}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading...</p>
      )
      
      }

      <label>Select Location</label>
    </div>
  );
  
  //ends here

  return (
    <div >
        <div className="container mt-5">
            <div className="card shadow-lg border-0 rounded-4" id='doc-bg'>
                <div className="card-body p-4">
                <h3 className="text-center mb-4">Request Patient Registration - Step {step}</h3>
                {messages}
                {loading}
                {validationGlobalErrorMsg}
              
                    <form > 
                      <div className="row">
                        
                        {/* Step 1: Personal Information */}
                        {step === 1 && (
                                            <>
                                            <h5 className="text-center mb-4">Personal Information</h5>
                                            
                                            {selectLocation}
                                         
                                                                                          
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="text" className="form-control" id="name" name="name" value={patientData.name} onChange={handleChange} placeholder="Full Name" />
                                                    <label htmlFor="name" className='mx-1'>Full Name</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.name}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="number" className="form-control" id="age" name="age" value={patientData.age} onChange={handleChange} placeholder="Age" />
                                                    <label htmlFor="age" className='mx-1'>Age</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.age}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="text" className="form-control" id="sex" name="sex" value={patientData.sex} onChange={handleChange} placeholder="Sex" />
                                                    <label htmlFor="sex" className='mx-1'>Sex</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.sex}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="relativeName" 
                                                        name="relativeName"
                                                        value={patientData.relativeName}
                                                        onChange={handleChange}
                                                        placeholder="Father/Mother/Spouse Name" 
                                                    />
                                                    <label htmlFor="relativeName" className='mx-1'>Father/Mother/Spouse Name</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.relativeName}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="phone" 
                                                        name="phone"
                                                        value={patientData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Phone Number" 
                                                    />
                                                    <label htmlFor="phone" className='mx-1'>Phone Number</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.phone}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        id="email" 
                                                        name="email"
                                                        value={patientData.email}
                                                        onChange={handleChange}
                                                        placeholder="Email" 
                                                    />
                                                    <label htmlFor="email" className='mx-1'>Email Address</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.email}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="identityProof" 
                                                        name="identityProof"
                                                        value={patientData.identityProof}
                                                        onChange={handleChange}
                                                        placeholder="Aadhar no, PAN no" 
                                                    />
                                                    <label htmlFor="identityProof" className='mx-1'>Identity Proof</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse?.validation_error?.identityProof}
                                                    </span>
                                                </div>

                                            </>
                            )}
                        {/* Step 2: Address Information */}
                        {step === 2 && (
                                            <>
                                            <h5 className="text-center mb-4">Address</h5>
                                            <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text"   
                                                  className="form-control" 
                                                  id="village" 
                                                  name="village"
                                                  value={patientData.village}
                                                  onChange={handleChange}
                                                  placeholder="Village" 
                                              />
                                              <label htmlFor="village" className='mx-1'>Village</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.village}
                                              </span>
                                          </div>

                                          <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text" 
                                                  className="form-control" 
                                                  id="po" 
                                                  name="po"
                                                  value={patientData.po}
                                                  onChange={handleChange}
                                                  placeholder="Post Office" 
                                              />
                                              <label htmlFor="po" className='mx-1'>Post Office</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.po}
                                              </span>
                                          </div>

                                          <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text" 
                                                  className="form-control" 
                                                  id="ps" 
                                                  name="ps"
                                                  value={patientData.ps}
                                                  onChange={handleChange}
                                                  placeholder="Police Station" 
                                              />
                                              <label htmlFor="ps" className='mx-1'>Police Station</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.ps}
                                              </span>
                                          </div>

                                          <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text" 
                                                  className="form-control" 
                                                  id="pin" 
                                                  name="pin"
                                                  value={patientData.pin}
                                                  onChange={handleChange}
                                                  placeholder="PIN Code" 
                                              />
                                              <label htmlFor="pin" className='mx-1'>PIN Code</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.pin}
                                              </span>
                                          </div>

                                          <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text" 
                                                  className="form-control" 
                                                  id="district" 
                                                  name="district"
                                                  value={patientData.district}
                                                  onChange={handleChange}
                                                  placeholder="District" 
                                              />
                                              <label htmlFor="district" className='mx-1'>District</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.district}
                                              </span>
                                          </div>

                                          <div className="form-floating mb-3 col-lg-6">
                                              <input 
                                                  type="text" 
                                                  className="form-control" 
                                                  id="state" 
                                                  name="state"
                                                  value={patientData.state}
                                                  onChange={handleChange}
                                                  placeholder="State" 
                                              />
                                              <label htmlFor="state" className='mx-1'>State</label>
                                              <span style={{ color: 'orange' }}>
                                                  {serverResponse?.validation_error?.state}
                                              </span>
                                          </div>
                                            </>
                            )}

                                
                        <div className="d-flex justify-content-center">
                            <button type="submit" onClick={requestPatientRegistration} className="btn btn-outline-primary col-md-3">Submit</button>
                        </div>
                      
                      </div>
                    </form>
               
                
                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                    {step > 1 && <button className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                    {step < 2 && <button className="btn btn-primary" onClick={nextStep}>Next</button>}
                </div>
                </div>
            </div>
        </div>
    </div>
    
  );
}

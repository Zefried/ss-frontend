import React, {useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import { useNavigate } from 'react-router-dom';


export const AddLab = () => {

    // Additional states starts from here
    const navigate = useNavigate();
    let token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);

    // Ends here





    // Component state starts from here 
            ////// Handling Server response for messages and errors
            const [serverResponse, setServerResponse] = useState({
                validation_error:'',
                message:{},
                error:{},
            });



            ////// Form state to hold all input data
            const [formData, setFormData] = useState({
              name: '',
              phone: '',
              email: '',
              registrationNo: '',
              buildingNo: '',
              landmark: '',
              workDistrict: '',
              state: '',
              password:'',
              });


    // Component state Ends here






    // Custom hooks starts here
        ////// This hook is used to clear response messages 
        customStateMethods.useClearAlert(setMessages);
        ////// ends here
    // Custom hooks ends here




 

    // Forms Step management starts here
    const [step, setStep] = useState(1);

            /////// Proceed to next step
            const nextStep = () => setStep(step + 1);
            
            /////// Go back to previous step
            const prevStep = () => setStep(step - 1);

    // Ends here





    // Component Function state starts from here

            //////// Function to handle input changes
            const handleChange = (e) => {
                setFormData({
                ...formData,
                [e.target.name]: e.target.value
                });
            };


            /////// This function is designed for user registration || comment otherwise
            const generatePassword = (name, phone) => {
                const namePart = name.slice(0, 4);  // Get first 4 characters of name
                const phonePart = phone.slice(-4);  // Get last 4 digits of phone
                return namePart + phonePart;        // Combine to form password
            };

    // Function ends here


 


    // Server request functions starts here

        //////// Submitting form data function starts here 
            function submitFormData(e) {
                e.preventDefault();
            
                setLoading(customStateMethods.spinnerDiv(true));
            
                try {
                // Generate the password
                const autoPassword = generatePassword(formData.name, formData.phone);
            
                // Update formData state with the generated password
                const updatedformData = {
                    ...formData,
                    password: autoPassword,
                    pswCred: autoPassword,
                };
            
                axios.get('sanctum/csrf-cookie').then(response => {
                    axios.post('api/admin/lab/add-lab', updatedformData, {
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
                            navigate('/admin/view-lab')
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
                console.log(error);  // Handle any unexpected errors
                }
            }



    // Server request functions ends here






    // Custom JSX schema starts here

        //////// Component Main form starts here

        let mainForm = (
            <div className="container mt-5">
                <div className="card shadow-lg border-0 rounded-4" id='doc-bg'>
                    <div className="card-body p-4">
                        <h3 className="text-center mb-4">Lab - Hospital Registration {step}</h3>
                        {messages}
                        {loading}
                        <form>
                            <div className="row g-3"> {/* Added g-3 for better spacing */}
                                {/* Step 1: Lab Information */}
                                {step === 1 && (
                                    <>
                                        <h5 className="text-center mb-4">Lab - Hospital Information</h5>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <select className="form-control" id="profession" name="profession" value={formData.profession} onChange={handleChange}>
                                                <option value="">Select Profession ? </option>
                                                <option value="lab">Lab</option>
                                                <option value="hospital">Hospital</option>
                                            </select>
                                            <label htmlFor="profession" className="mx-1">Profession</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.profession || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
                                            <label htmlFor="name" className='mx-1'>Name of Lab/Hospital</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.name || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                                            <label htmlFor="phone" className='mx-1'>Phone Number</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.phone || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                                            <label htmlFor="email" className='mx-1'>Email Address</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.email || ''}</span>
                                        </div>
                                    </>
                                )}
                                {/* Step 2: Working Address Information */}
                                {step === 2 && (
                                    <>
                                     <h5 className="text-center mb-4">Working Address</h5>
                                 
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="buildingNo" name="buildingNo" value={formData.buildingNo} onChange={handleChange} placeholder="Building Number" />
                                            <label htmlFor="buildingNo" className='mx-1'>Building Number, Block, and Road Address</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.buildingNo || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark" />
                                            <label htmlFor="landmark" className='mx-1'>Landmark</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.landmark || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="state" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                                            <label htmlFor="state" className='mx-1'>State</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.state || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="workDistrict" name="workDistrict" value={formData.workDistrict} onChange={handleChange} placeholder="Work District" />
                                            <label htmlFor="workDistrict" className='mx-1'>Work District</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.workDistrict || ''}</span>
                                        </div>
                                        <div className="form-floating mb-3 col-12 col-md-6">
                                            <input type="text" className="form-control" id="registrationNo" name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder="Registration No" />
                                            <label htmlFor="registrationNo" className='mx-1'>Registration No</label>
                                            <span style={{ color: 'orange' }}>{serverResponse?.validation_error?.registrationNo || ''}</span>
                                        </div>


                                    </>
                                )}
                                <div className="d-flex justify-content-center">
                                    {step > 1 && (<button type="button" onClick={submitFormData} className="btn btn-outline-primary col-6 col-md-3">Submit</button>)}
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
        )
        

        //////// Ends here



        //////// Global Validation error messages starts here
        let validationGlobalErrorMsg = '';

        if (serverResponse?.validation_error) {
          
            const formattedErrors = Object.entries(serverResponse.validation_error)
                .map(([field]) => `${field}`);
        
            validationGlobalErrorMsg = (
                <div class="alert alert-warning mt-4 col-lg-11" role="alert"> 
                    <h5>{`There is a validation error. Please check the following fields : ${formattedErrors}`}</h5>
                </div>
            );
        }
        //////// Ends here

    // Custom Jsx schema ends here

  



  return (
    <div >
        
        {validationGlobalErrorMsg}

        {/* main form starts here */}
        {mainForm}
        {/* ends here */}



    </div>
    
  );
}

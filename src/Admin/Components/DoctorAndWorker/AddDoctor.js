import React, {useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import { useNavigate } from 'react-router-dom';


export const AddDoctors = () => {

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
                age: '',
                sex: '',
                relativeName: '',  // Father, Mother, or Spouse
                phone: '',
                email: '',
                registrationNo: '',
                village: '',
                po: '',
                ps: '',
                pin: '',
                district: '',
                buildingNo: '',
                landmark: '',
                workDistrict: '',
                state: '',
                designation: '',
                password:'',
                pswCred:'',
                unique_user_id:'',
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
                    axios.post('api/admin/doctors/add-doctor', updatedformData, {
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
                            navigate('/admin/view-doctors')
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
                    <h3 className="text-center mb-4">Register Doctor & Sewak | {step}</h3>
                    {messages}
                    {loading}
                
                        <form > 
                        <div className="row">
                            
                            {/* Step 1: Personal Information */}
                            {step === 1 && (
                                                <>
                                                <h5 className="text-center mb-4">Personal Information</h5>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <select className="form-control" id="profession" name="profession" value={formData.profession} onChange={handleChange} >
                                                        <option value="">Select Profession ? </option>
                                                        <option value="doctor">Doctor</option>
                                                        <option value="worker">Sewak</option>
                                                    </select>
                                                    <label htmlFor="profession" className="mx-1">Profession</label>
                                                    <span style={{ color: 'orange' }}>
                                                        {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.profession : ''}
                                                    </span>
                                                </div>

                                            
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
                                                    <label htmlFor="name" className='mx-1'>Full Name</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.name : ''}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="number" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                                                    <label htmlFor="age" className='mx-1'>Age</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.age : ''}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input type="text" className="form-control" id="sex" name="sex" value={formData.sex} onChange={handleChange} placeholder="Sex" />
                                                    <label htmlFor="sex" className='mx-1'>Sex</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.sex : ''}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="relativeName" 
                                                    name="relativeName"
                                                    value={formData.relativeName}
                                                    onChange={handleChange}
                                                    placeholder="Father/Mother/Spouse Name" 
                                                    />
                                                    <label htmlFor="relativeName" className='mx-1'>Father/Mother/Spouse Name</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.relativeName : ''}
                                                    </span>

                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="phone" 
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone Number" 
                                                    />
                                                    <label htmlFor="phone" className='mx-1'>Phone Number</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.phone : ''}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    id="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email" 
                                                    />
                                                    <label htmlFor="email" className='mx-1'>Email Address</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.email : ''}
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="registrationNo" 
                                                    name="registrationNo"
                                                    value={formData.registrationNo}
                                                    onChange={handleChange}
                                                    placeholder="Registration Number" 
                                                    />
                                                    <label htmlFor="registrationNo" className='mx-1'>Registration Number</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.registrationNo : ''}
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
                                                    value={formData.village}
                                                    onChange={handleChange}
                                                    placeholder="Village" 
                                                    />
                                                    <label htmlFor="village" className='mx-1'>Village</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.village : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="po" 
                                                    name="po"
                                                    value={formData.po}
                                                    onChange={handleChange}
                                                    placeholder="Post Office" 
                                                    />
                                                    <label htmlFor="po" className='mx-1'>Post Office</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.po : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="ps" 
                                                    name="ps"
                                                    value={formData.ps}
                                                    onChange={handleChange}
                                                    placeholder="Police Station" 
                                                    />
                                                    <label htmlFor="ps" className='mx-1'>Police Station</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.ps : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="pin" 
                                                    name="pin"
                                                    value={formData.pin}
                                                    onChange={handleChange}
                                                    placeholder="PIN Code" 
                                                    />
                                                    <label htmlFor="pin" className='mx-1'>PIN Code</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.pin : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="district" 
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleChange}
                                                    placeholder="District" 
                                                    />
                                                    <label htmlFor="district" className='mx-1'>District</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.district : ''}
                                                    </span>
                                                </div>
                                                </>
                                )}

                            {/* Step 3: Working Address Information */}
                            {step === 3 && (
                                                <>
                                                <h5 className="text-center mb-4">Working Address</h5>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="buildingNo" 
                                                    name="buildingNo"
                                                    value={formData.buildingNo}
                                                    onChange={handleChange}
                                                    placeholder="Building Number" 
                                                    />
                                                    <label htmlFor="buildingNo" className='mx-1'>Building Number</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.buildingNo : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="landmark" 
                                                    name="landmark"
                                                    value={formData.landmark}
                                                    onChange={handleChange}
                                                    placeholder="Landmark" 
                                                    />
                                                    <label htmlFor="landmark" className='mx-1'>Landmark</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.landmark : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="workDistrict" 
                                                    name="workDistrict"
                                                    value={formData.workDistrict}
                                                    onChange={handleChange}
                                                    placeholder="District" 
                                                    />
                                                    <label htmlFor="workDistrict" className='mx-1'>District</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.workDistrict : ''}
                                                    </span>
                                                </div>
                                                <div className="form-floating mb-3 col-lg-6">
                                                    <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="state" 
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    placeholder="State" 
                                                    />
                                                    <label htmlFor="state" className='mx-1'>State</label>
                                                    <span style={{ color: 'orange' }}>
                                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.state : ''}
                                                    </span>
                                                </div>
                                                </>
                                )}

                                    
                            <div className="d-flex justify-content-center">
                            {step > 2 && ( <><button type="button" onClick={submitFormData} className="btn btn-outline-primary col-md-3">Submit</button></>)}
                            </div>
                        

                        </div>
                        </form>
                
                    
                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        {step > 1 && <button className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                        {step < 3 && <button className="btn btn-primary" onClick={nextStep}>Next</button>}
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

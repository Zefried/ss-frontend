import React from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customStateMethods } from '../../../../StateMng/Slice/AuthSlice';
import axios from 'axios';

export const AssignEmployee = () => {

    
    // Additional states starts from here
    const navigate = useNavigate();
    let token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    // Ends here

    const {id} = useParams();

     // Component state starts from here 
            ////// Handling Server response for messages and errors
            const [serverResponse, setServerResponse] = useState({
                validation_error:'',
                message:{},
                error:{},
            });

            ////// Handling main form data
            const [formData, setFormData] = useState({
                name: '',
                email: '',
                phone: '',
                role: 'lab-billing',
                lab_id:id,
            });

    // ends here



    // All functions starts here

        /////// function to handle main form onChange
        function handleChange(e){
            setFormData(
            {...formData, 
                [e.target.name]:e.target.value
            })
        }


        /////// function to handle main form onChange

        function handleSubmit(e){
            e.preventDefault();
            
            setLoading(customStateMethods.spinnerDiv(true));
                
            try {
        
            axios.get('sanctum/csrf-cookie').then(response => {
                axios.post(`api/admin/employee/add-employee/${id}`, formData, {
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
                        navigate('/admin/view-lab-employee')
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

    // ends here



  return (
    <div>   
        {loading}
        {messages}
    
        {/* adding employee information */}
        <div className="container mt-5">
            <h2 className="text-center mb-4">Employee Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Role</label>
                        <input
                        disabled
                        type="text"
                        className="form-control"
                        id="role"
                        name="role"
                        placeholder="Enter your role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        />
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary mt-2">Add Employee</button>
            </form>
        </div>
    </div>
  )
}

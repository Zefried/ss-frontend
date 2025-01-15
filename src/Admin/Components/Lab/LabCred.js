import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const LabCred = () => {
  
    // Retrieve token from custom state
    let token = customStateMethods.selectStateKey('appState', 'token');



  
    // Local state for loading status, messages, password state, password data, and account data
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const [pswState, setPswState] = useState(false); // Track the visibility of the password input
    const [pswData, setPswData] = useState({}); // Store new password data
    




    const [accountData, setAccountData] = useState(null); // Store fetched account data




    
    // Clear alerts when component mounts
    customStateMethods.useClearAlert(setMessages);




    
    // Get the account ID from URL parameters
    const { id } = useParams();






    // Fetch account credentials on component mount and when pswState changes
    useEffect(() => {
        try {
            // Show loading spinner
            setLoading(customStateMethods.spinnerDiv(true));

            // Fetch CSRF cookie
            axios.get('sanctum/csrf-cookie').then(response => {
                // Fetch account credentials
                axios.get(`/api/admin/doctors/fetch-doctorCred/${id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                })
                .then((res) => {
                    // Check response status
                    if (res.data.status === 200) {
                        setAccountData(res.data.data); // Set account data
                        setMessages(customStateMethods.getAlertDiv(res.data.message)); // Set success message
                    } else {
                        setMessages(customStateMethods.getAlertDiv(res.data.message)); // Set error message
                        setLoading(false); // Hide loading spinner
                    }
                    setLoading(false); // Hide loading spinner
                });
            });
        } catch (error) {
            setLoading(false); // Hide loading spinner on error
            console.log(error); // Log error
        }

    }, [pswState]); // Dependency on pswState






    // Handle input changes for new password
    function handleNewPsw(e) {
        setPswData({ ...pswData, [e.target.name]: e.target.value });
    }





    // Handle new password submissions
    const handlePasswordSubmit = () => {
        try {
            // Show loading spinner
            setLoading(customStateMethods.spinnerDiv(true));

            // Fetch CSRF cookie
            axios.get('sanctum/csrf-cookie').then(response => {
                // Submit new password
                axios.post(`/api/admin/lab/change-lab-psw/${id}`, pswData, {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => {
                    // Check response status
                    if (res.data.status === 200) {
                        setMessages(customStateMethods.getAlertDiv(res.data.message)); // Set success message
                    } else {
                        setMessages(customStateMethods.getAlertDiv(res.data.message)); // Set error message
                        setLoading(false); // Hide loading spinner
                    }
                });
            });
        } catch (error) {
            setLoading(false); // Hide loading spinner on error
            console.log(error); // Log error
        }
        setPswState(false); // Reset password state after submission
    };



    

    // Render account card if account data is available
    const userCard = accountData ? (
        <div className="d-flex justify-content-center">
            <div className="card mt-3 shadow-sm" style={{ width: "500px" }}>
                <div className="card-body text-center">
                    <h5 className="card-title"><span>Name: </span>{accountData.name}</h5>
                    <p className="card-text"><strong>Email:</strong> {accountData.email}</p>
                    <p className="card-text"><strong>Password:</strong> {accountData.pswCred}</p>
                    <div className="d-flex justify-content-center mt-5">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => setPswState(prevState => !prevState)}>
                            Generate New Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;







    // Render password input field if password state is true
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






    // Main render
    return (
        <div>
            {loading}
            {messages}
            <p className="h3 text-center">View User Credentials {userCard}</p>
            {pswInputField}
        </div>
    );
}

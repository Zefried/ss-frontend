import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const LabInformation = () => {


    // Retrieve token from custom state
    let token = customStateMethods.selectStateKey('appState', 'token');




    // Component state variables
    const [loading, setLoading] = useState(null); // Loading spinner state
    const [messages, setMessages] = useState(null); // State for alert messages
    const [fullData, setFullData] = useState(null); // State to hold doctor data




    // Clear alert messages using custom hook
    customStateMethods.useClearAlert(setMessages);


    

    // Extract doctor ID from URL parameters
    const { id } = useParams();





    // Effect to fetch doctor data when component mounts
    useEffect(() => {
        try {
            setLoading(customStateMethods.spinnerDiv(true)); // Show loading spinner

            // Send CSRF token request
            axios.get('sanctum/csrf-cookie').then(response => {
                // Fetch doctor details API call
                axios.get(`api/admin/lab/fetch-lab-single-account-data/${id}`, {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => {
                    // Check for successful response
                    if (res.data.status === 200) {
                        setFullData(res.data.listData); // Set doctor data
                        setMessages(customStateMethods.getAlertDiv(res.data.message)); // Set success message
                    } else {
                        // Handle error response
                        setMessages(customStateMethods.getAlertDiv(res.data.message));
                        setLoading(false); // Hide loading spinner
                    }

                    // Hide loading spinner if response received
                    if (res.data) {
                        setLoading(false);
                    }
                });
            });
        } catch (error) {
            setLoading(false); // Hide loading spinner on error
            console.log(error); // Log unexpected error
        }
    }, []); // Empty dependency array means this effect runs once on mount




    // Render full info cards
    let dataCards = '';
    if (fullData) {
        dataCards = fullData.map((item, index) => (
            <div key={index} className="card my-3">
                <div className="card-header d-flex justify-content-between bg-primary text-white">
                    <h5 className="card-title mb-0">User Details: {item.name}</h5>
                    <Link className='btn btn-outline-light' to={'/admin/view-lab'}>Back</Link>
                </div>
                <div className="card-body">
                    {/* Personal Information Section */}
                    <h6 className="text-uppercase fw-bold mt-3">Personal Information</h6>
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>ID:</strong> {item.id}</li>
                                <li className="list-group-item"><strong>Name:</strong> {item.name}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <h6 className="text-uppercase fw-bold mt-4">Contact Information</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Phone:</strong> {item.phone}</li>
                                <li className="list-group-item"><strong>Email:</strong> {item.email}</li>
                            </ul>
                        </div>

                        {/* Work Address Section */}
                        <div className="col-md-6">
                            <h6 className="text-uppercase fw-bold mt-4">Work Address</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Building No:</strong> {item.buildingNo}</li>
                                <li className="list-group-item"><strong>Landmark:</strong> {item.landmark}</li>
                                <li className="list-group-item"><strong>District:</strong> {item.district}</li>
                                <li className="list-group-item"><strong>State:</strong> {item.state}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div>
            {loading} {/* Render loading spinner */}
            {messages} {/* Render alert messages */}

            <p className="h3 text-center">Complete Information</p>
            {dataCards} {/* Render full info cards */}
        </div>
    );
};

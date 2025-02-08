import React, { useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../StateMng/Slice/AuthSlice';
import { useNavigate } from 'react-router-dom';


export const AdminLogin = () => {
    
    customStateMethods.initializeState();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState(null);
    const [serverResponse, setServerResponse] = useState({});

    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post('api/admin-login', inputData)
            .then((res) => {
                setServerResponse(res.data);
                if (res.data.status !== 200) {
                    setMessages(res.data.message);
                    
               
                } else {
                    setMessages('Login successful!');
        
                    customStateMethods.dispatch({
                        role:res.data.role,
                        isAuthenticated:true,
                        token: res.data.token
                    }); 
                    
                    navigate('/admin');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setMessages('An error occurred. Please try again.');
                setLoading(false);
            });
    };

    return (
        <div>
            {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
            {messages && <div className="alert alert-info" role="alert">{messages}</div>}

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4">Admin Login</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="email" 
                                            placeholder="name@example.com" 
                                            name='email'
                                            onChange={handleChange} 
                                        />
                                        <label htmlFor="email">Email address</label>
                                        {serverResponse.validation_error && <div className="text-danger">{serverResponse.validation_error.email}</div>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password" 
                                            placeholder="Password" 
                                            name='password'
                                            onChange={handleChange} 
                                        />
                                        <label htmlFor="password">Password</label>
                                        {serverResponse.validation_error && <div className="text-danger">{serverResponse.validation_error.password}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


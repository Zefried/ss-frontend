import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AdminRegister = () => {
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(''); // 'success' or 'danger'
    const navigate = useNavigate();

    const [serverResponse, setServerResponse] = useState({
        validation_error: {},
        message: {},
        error: {},
    });

    const [inputData, setData] = useState({
        name: '',
        email: '',
        password: '',
        pswCred: '',
        role: 'admin',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
            ...(name === 'password' && { pswCred: value }),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.get('sanctum/csrf-cookie').then(response => {
            axios.post('api/admin-register', inputData)
                .then((res) => {
                    setServerResponse((prevData) => ({
                        ...prevData,
                        validation_error: res.data.validation_error || {},
                        message: res.data.message,
                        error: res.data.error
                    }));

                    if (res.data.status !== 200) {
                        setAlertMessage(res.data.message);
                        setAlertType('danger');
                    } else {
                        setAlertMessage(res.data.message);
                        setAlertType('success');
                        navigate('/admin-login');
                    }

                    setLoading(false);
                })
                .catch(error => {
                    console.log(error);  // Handle API error
                    setAlertMessage('An error occurred. Please try again.');
                    setAlertType('danger');
                    setLoading(false);
                });
        });
    };

    return (
        <div>
            {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
            {alertMessage && <div className={`alert alert-${alertType}`} role="alert">{alertMessage}</div>}

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4">Admin Register</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="name"
                                            className="form-control"
                                            id="name"
                                            placeholder="john"
                                            value={inputData.name}
                                            name='name'
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="name">Name</label>
                                        {serverResponse.validation_error.name && <div className="text-danger">{serverResponse.validation_error.name}</div>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="name@example.com"
                                            value={inputData.email}
                                            name='email'
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="email">Email address</label>
                                        {serverResponse.validation_error.email && <div className="text-danger">{serverResponse.validation_error.email}</div>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name='password'
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                            value={inputData.password}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="password">Password</label>
                                        {serverResponse.validation_error.password && <div className="text-danger">{serverResponse.validation_error.password}</div>}
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">Register</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
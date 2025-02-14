import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import { Link, useParams } from 'react-router-dom';

export const ViewPatientFullInfo = () => {
    let token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const [patientData, setPatientData] = useState(null);

    customStateMethods.useClearAlert(setMessages);

    const { id } = useParams();

    useEffect(() => {
        try {
            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(response => {
                axios.get(`api/user/patient-crud/patient-full-info/${id}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => {
                    if (res.data.status === 2) { // Updated status check to 2
                        setPatientData(res.data.patientData); // Updated to patientData
                        setMessages(customStateMethods.getAlertDiv(res.data.message));
                    } else {
                        setMessages(customStateMethods.getAlertDiv(res.data.message));
                        setLoading(false);
                    }

                    if (res.data) {
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
            });
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, [id, token]);

    return (
        <div>
            {loading}
            {messages}
            <p className="h3 text-center">Complete Patient Information</p>

            {patientData && (
                <div className="card my-3">
                    <div className="card-header d-flex justify-content-between bg-primary text-white">
                        <h5 className="card-title mb-0">Patient Details: {patientData.name}</h5>
                        <Link className='btn btn-outline-light' to={'/user/view-patient'}>Back</Link>
                    </div>
                    <div className="card-body">
                        {/* Personal Information */}
                        <h6 className="text-uppercase fw-bold mt-3">Personal Information</h6>
                        <div className="row">
                            <div className="col-md-6">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>ID:</strong> {patientData.id}</li>
                                    <li className="list-group-item"><strong>Name:</strong> {patientData.name}</li>
                                    <li className="list-group-item"><strong>Age:</strong> {patientData.age}</li>
                                    <li className="list-group-item"><strong>Sex:</strong> {patientData.sex}</li>
                                    <li className="list-group-item"><strong>Relative Name:</strong> {patientData.relativeName}</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Identity Proof:</strong> {patientData.identityProof}</li>
                                    <li className="list-group-item"><strong>Village:</strong> {patientData.village}</li>
                                    <li className="list-group-item"><strong>PO:</strong> {patientData.po}</li>
                                    <li className="list-group-item"><strong>PS:</strong> {patientData.ps}</li>
                                    <li className="list-group-item"><strong>Pin Code:</strong> {patientData.pin}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="row mt-5">
                            <div className="col-md-6">
                                <h6 className="text-uppercase fw-bold mt-4">Contact Information</h6>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Phone:</strong> {patientData.phone}</li>
                                    <li className="list-group-item"><strong>Email:</strong> {patientData.email}</li>
                                    <li className="list-group-item"><strong>Associated User Email:</strong> {patientData.associated_user_email}</li>
                                </ul>
                            </div>

                            {/* Address Information */}
                            <div className="col-md-6">
                                <h6 className="text-uppercase fw-bold mt-4">Address Information</h6>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>District:</strong> {patientData.district}</li>
                                    <li className="list-group-item"><strong>State:</strong> {patientData.state}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="row mt-5">
                            <div className="col-md-12">
                                <h6 className="text-uppercase fw-bold mt-4">Additional Information</h6>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Created At:</strong> {new Date(patientData.created_at).toLocaleString()}</li>
                                    <li className="list-group-item"><strong>Updated At:</strong> {new Date(patientData.updated_at).toLocaleString()}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
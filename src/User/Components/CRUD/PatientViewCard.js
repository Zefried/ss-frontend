import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { customStateMethods } from '../../../../Admin/protected/CustomAppState/CustomState';
import userIcon from  '../../../../Assets/img/registration/userIcon.jpeg';

export const PatientViewCard = () => {
    let token = customStateMethods.selectStateKey('appState', 'token');
    const { id } = useParams();

    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);

    const [countData, setCountData] = useState([]);
    const [patientData, setPatientData] = useState([]);

    useEffect(() => {
        try {
            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(() => {
                axios.get(`/api/user/view-patient-card/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then((res) => {
                        if (res.data.status === 200) {
                            const patientCountData = res.data.patientCountData;

                            setCountData(patientCountData.map(({ patient_data, ...rest }) => rest));
                            setPatientData(patientCountData.map(item => item.patient_data));

                            setMessages(customStateMethods.getAlertDiv(res.data.message));
                        } else {
                            setMessages(customStateMethods.getAlertDiv(res.data.message));
                        }
                        setLoading(false);
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

            <div className="container mt-5">
                {patientData.length > 0 && countData.length > 0 ? (
                    patientData.map((patient, index) => (
                        <div key={index} className="card shadow-lg border-0 rounded-3 mb-4">
                            <div className="card-body">
                               

                                <h1 className="mb-4 text-primary"> Patient Card</h1>
                                <img className='mb-4' src={userIcon} style={{ width:'70px', height:'70px' }}></img>
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="fs-4"><strong>Patient Name:</strong> {patient.name || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <p className="fs-4"><strong>Location (District):</strong> {patient.district || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="fs-4"><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <p className="fs-4"><strong>Patient Card ID:</strong> {countData[index]?.patient_card_id || 'N/A'}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No patient data available.</p>
                )}
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { customStateMethods } from '../../Admin/protected/CustomAppState/CustomState';
import userIcon from '../../Assets/img/registration/userIcon.jpeg';

export const ViewPendingPatient = () => {

    let token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);

    const [patientData, setPatientData] = useState(null);
    
    customStateMethods.useClearAlert(setMessages);

  
    useEffect(()=>{
        try{
    
            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(response => {
                axios.get(`/api/user/fetch-xuser-pending-patient/`,{
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  })
                  .then((res) => {
                       
                       if(res.data.status === 200){
                        setPatientData(res.data.patient_data);
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                       }else{
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                       }
                      if(res.data){
                        setLoading(false);
                      }
                  })
            });
        }catch(error){
            setLoading(false);
            console.log(error);
        }

    },[])


    const patientTable = patientData ? patientData.map((items, index) => (
        <tr key={items.id}>
            <td>{index + 1}</td>
            <td>
                <img className='userIcon' src={userIcon} alt="User Icon" />
            </td>
            <td>{items.name}</td>
            <td>{items.age}</td>
            <td>{items.sex}</td>
            <td>{items.phone}</td>
            <td>{items.district}</td> {/* Added district */}
            <td>{items.state}</td> {/* Added state */}
            <td>
                <Link to={`/admin/edit-patient/${items.id}`} className='btn btn-outline-success btn-sm'>Edit</Link>
            </td>
            <td>
                <Link to={`/admin/full-information/${items.id}`} className='btn btn-outline-primary btn-sm'>Full Info</Link>
            </td>
            <td>
                <button className='btn btn-outline-danger btn-sm'>Disable</button>
            </td>
        </tr>
    )) : null;
    

    return (
        <div>
            {loading}
            {messages}
            <p className="h3 text-center">View All Patient</p>
    
            <div className="table-responsive table-container">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Sex</th>
                        <th>Phone</th>
                        <th>District</th> {/* Added District */}
                        <th>State</th> {/* Added State */}
                        <th>Edit</th>
                        <th>Full Info</th>
                        <th>Disable</th>
                    </tr>
                    </thead>
                    <tbody>
                        {patientTable}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
}

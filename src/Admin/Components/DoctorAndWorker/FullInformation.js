import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import { Link, useParams } from 'react-router-dom';

export const FullInformation = () => {

    let token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);

    const [docData, setDocData] = useState(null);
    
    customStateMethods.useClearAlert(setMessages);

    const {id } = useParams();

    useEffect(()=>{
        try{

            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(response => {
                axios.post(`api/admin/doctors/fetch-doctor/${id}`, {}, {
                    headers: { 'Content-Type': 'application/',
                        Authorization:`Bearer ${token}`
                    }
                })
                  .then((res) => {
                       if(res.data.status === 200){
                        setDocData(res.data.doc_data);
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                       }else{
                        setMessages(customStateMethods.getAlertDiv(res.data.message))
                        setLoading(false);
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

    let docCards = '';
   
    if (docData) {

        docCards = docData.map((item, index) => {

        return (
            <div key={index} className="card my-3">
            <div className="card-header d-flex justify-content-between  bg-primary text-white">
                <h5 className="card-title mb-0">User Details: {item.name}</h5>
                <Link className='btn btn-outline-light' to={'/admin/view-doctors'} >Back</Link>
            </div>
            <div className="card-body">
           
                {/* Personal Information */}
                    <h6 className="text-uppercase fw-bold mt-3">Personal Information</h6>
                        <div className="row">
                            <div className="col-md-6">
                        
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>ID:</strong> {item.id}</li>
                                <li className="list-group-item"><strong>Name:</strong> {item.name}</li>
                                <li className="list-group-item"><strong>Age:</strong> {item.age}</li>
                                <li className="list-group-item"><strong>Sex:</strong> {item.sex}</li>
                                <li className="list-group-item"><strong>Relative Name:</strong> {item.relativeName}</li>
                            </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Registration No:</strong> {item.registrationNo}</li>
                                    <li className="list-group-item"><strong>Village:</strong> {item.village}</li>
                                    <li className="list-group-item"><strong>PO:</strong> {item.po}</li>
                                    <li className="list-group-item"><strong>PS:</strong> {item.ps}</li>
                                    <li className="list-group-item"><strong>Pin:</strong> {item.pin}</li>
                                </ul>
                            </div>
                        </div>

                    {/* Contact Information */}
                  
                        <div className="row mt-5">
                            <div className="col-md-6">
                                <h6 className="text-uppercase fw-bold mt-4">Contact Information</h6>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Phone:</strong> {item.phone}</li>
                                    <li className="list-group-item"><strong>Email:</strong> {item.email}</li>
                                    <li className="list-group-item"><strong>Designation:</strong> {item.designation}</li>
                                </ul>
                            </div>
                             
                             {/* Work Address */}
                            <div className="col-md-6">
                                <h6 className="text-uppercase fw-bold mt-4">Work Address</h6>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Building No:</strong> {item.buildingNo}</li>
                                        <li className="list-group-item"><strong>Landmark:</strong> {item.landmark}</li>
                                        <li className="list-group-item"><strong>Work District:</strong> {item.workDistrict}</li>
                                        <li className="list-group-item"><strong>State:</strong> {item.state}</li> 
                                    </ul>
                            </div>
                        </div>

                   
            </div>
            </div>
        );
    });
    }

  return (
    <div>
        {loading}
        {messages}
        <p className="h3 text-center">Complete Information</p>

        {docCards}

    </div>
  )
}

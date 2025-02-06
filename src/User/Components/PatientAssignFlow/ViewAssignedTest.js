import React, { useState, useEffect } from 'react';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import labIcon from '../../../assets/img/lab/labIcon.jpg';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export const ViewAssignedTest = () => {
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      axios.get('/api/user/patient-assign-flow/view-assigned-tests', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setData(res.data?.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, [token]);
  
    return (
      <div>
        {loading && <p>Loading...</p>}
        <p className='h3 text-center mt-3'>View Assigned Tests</p>
        <div className='table-responsive'>
          <table className='table table-striped table-bordered'>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>District</th>
                <th>Assigned Tests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.patient_data.name}</td>
                  <td>{item.patient_data.age}</td>
                  <td>{item.patient_data.phone}</td>
                  <td>{item.patient_data.district}</td>
                  <td>{item.tests.map(test => test.name).join(', ')}</td>
                  <td>
                    <button className='btn btn-outline-danger btn-sm mx-2'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
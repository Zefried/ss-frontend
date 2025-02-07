import React, { useState, useEffect } from 'react';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export const ViewAssignedTest = () => {
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);
  
    useEffect(() => {
      setLoading(true);
      axios.get('/api/user/patient-assign-flow/view-assigned-tests', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setData(res.data?.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, [token]);
  
    const handleShowTests = (tests) => {
      setSelectedTests(tests);
      const modal = new bootstrap.Modal(document.getElementById('testsModal'));
      modal.show();
    };

    const handleCloseModal = () => {
        const modalElement = document.getElementById('testsModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }
      };
      
  
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
                  <td>
                    <button className='btn btn-info btn-sm' onClick={() => handleShowTests(item.tests)}>View Tests</button>
                  </td>
                  <td>
                    <button className='btn btn-outline-danger btn-sm mx-2'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Bootstrap Modal for viewing tests */}
        <div className='modal fade' id='testsModal' tabIndex='-1' aria-labelledby='testsModalLabel' aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='testsModalLabel'>Assigned Tests</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <ul>
                  {selectedTests.map(test => (
                    <li key={test.id}>{test.name}</li>
                  ))}
                </ul>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
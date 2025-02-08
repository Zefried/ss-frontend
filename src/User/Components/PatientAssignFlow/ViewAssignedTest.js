import React, { useState, useEffect } from 'react';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import axios from 'axios';
import patientIcon from '../../../assets/img/patient/patient.png';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { Home } from '../../../Dashboard/Home';
import { Link } from 'react-router-dom';


// viewAssignedPatient Component
export const ViewAssignedTest = () => {
    const token = customStateMethods.selectStateKey('appState', 'token');
    let role = customStateMethods.selectStateKey('appState', 'role');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // State to store selected item

  
    useEffect(() => {
      setLoading(true);
      axios.get('/api/user/patient-assign-flow/view-assigned-patients', { headers: { Authorization: `Bearer ${token}` } })
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

    const handleSearch = (e) => {
      setLoading(true);
  
      const searchValue = e.target.value;
      setQuery(searchValue);

      if(searchValue.length > 3) {

          axios.get('/api/user/patient-assign-flow/search-assigned-patient', {
            params: { query: searchValue },
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => {
            setSuggestions(res.data.results);
            setLoading(false)
          })
          .catch(err => console.error(err) && setLoading(false));
      }
     
  
  
    };
  
    const handleSelectItem = (selected) => {
      setSelectedItem(selected); // Update table data with selected item
      setSuggestions([]); // Hide suggestions after selection
      setQuery('');
    };

      
  
    return (
      <div>
        {loading && <p>Loading...</p>}
        
        <p className='h3 text-center mt-3'>View Assigned Patients</p>

        <input className='form-control' type='text' value={query} onChange={handleSearch} placeholder='Search for the assigned patient, e.g., 9953xxxx. || Type minimum 4 characters' />

        {/* Search Suggestions */}
        <div className="list-group col-lg-4">
          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div 
                key={i} 
                className="list-group-item list-group-item-action d-flex align-items-center mt-3"
                onClick={() => handleSelectItem(s)}
                style={{ cursor: "pointer" }}
              >
                <img src={patientIcon} alt="Patient" className="rounded-circle me-2" style={{ width: "30px", height: "30px" }} />
                
                <div>
                  <span>Name: {s.patient_data?.name}</span>
                  <br />
                  <span>Phone: {s.patient_data?.phone}</span>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>

        
        {selectedItem ? (
          // Render selected item details
          <div className="card p-3">
            <h4>Selected Patient</h4>
            <p><strong>Name:</strong> {selectedItem.patient_data?.name}</p>
            <p><strong>Age:</strong> {selectedItem.patient_data?.age}</p>
            <p><strong>Phone:</strong> {selectedItem.patient_data?.phone}</p>
            <p><strong>District:</strong> {selectedItem.patient_data?.district}</p>

            <td>
              <button className="btn btn-info btn-sm" onClick={() => handleShowTests(selectedItem.tests)}>View Tests</button>
            </td>

            {
              role == "admin" && (
                <td>
                  <button className="btn btn-info btn-sm mt-3" onClick={() => setSelectedItem(null)}>Back to List</button>
                </td>
              )
            }

            {
              (role === 'lab' || role === 'hospital') && (
                <td>
                  <Link className="btn btn-info btn-sm mt-3" to="/test">Proceed To Billing</Link>
                </td>
              )
            }


          </div>
        ) : (
        
            (role === "admin" || role === "user") && (
              <div className="table-responsive mt-3">
                <table className="table table-striped table-bordered">
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
                          <button className="btn btn-info btn-sm" onClick={() => handleShowTests(item.tests)}>View Tests</button>
                        </td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm mx-2">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        
          
        )}

  
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
  
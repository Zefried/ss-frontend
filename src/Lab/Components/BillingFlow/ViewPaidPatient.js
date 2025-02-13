import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import patientIcon from '../../../assets/img/patient/patient.png';

export const ViewPaidPatient = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  let role = customStateMethods.selectStateKey('appState', 'role');

  const [query, setQuery] = useState('');
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [token]);

  const fetchPatients = () => {
    setLoading(true);
    axios.get('/api/lab/flow/view-paid-patients', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setListData(response.data);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };


  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      setLoading(true);
      axios.get('/api/lab/flow/search-paid-patients', {
        params: { query: searchValue },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setSuggestions(Array.isArray(res.data?.patient_data) ? res.data.patient_data : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  };

  

  return (
    <div>
      {loading && <p>Loading...</p>}
      <input className='form-control' type='text' value={query} onChange={handleSearch} placeholder='Search...' />
      
      {suggestions.length > 0 && (
        <div className="list-group col-lg-4">
          {suggestions.map((s, i) => (
            <div 
              key={s.id} 
              className="list-group-item list-group-item-action d-flex align-items-center mt-3"
              style={{ cursor: "pointer" }}
            >
              <img src={patientIcon} alt="Patient" className="rounded-circle me-2" style={{ width: "30px", height: "30px" }} />
              <div>
                <span>Name: {s.name}</span>
                <br />
                <span>Phone: {s.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className='h3 text-center mt-3'>View Paid Patients</p>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>District</th>
              {
                role !== 'admin'(
                  <th>Actions</th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {listData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td><img className='userIcon' src={patientIcon} alt='User Icon' style={{ height: '35px', width: '35px' }} /></td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>{item.district}</td>
                {role !== 'admin' && (
                  <td>
                    <Link to={`/lab/view-paid-patient-bill/${item.id}`} className='btn btn-outline-primary btn-sm mx-2'>View Bill</Link>
                  </td>
                )}


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

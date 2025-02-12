import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import patientIcon from '../../../assets/img/patient/patient.png';

export const ViewAllPatient = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const role = customStateMethods.selectStateKey('appState', 'role');
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to store selected item

  useEffect(() => {

    setLoading(true);

    axios.get('/api/user/patient-crud/view-patient', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const data = response.data?.listData || [];
      setListData(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));

    const checkVisit = async () => {
      const res = await axios.get('/api/user/patient-assign-flow/check-visit', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
    }

    checkVisit();

  }, [token]);

  const handleSearch = (e) => {
    setLoading(true);

    const searchValue = e.target.value;
    setQuery(searchValue);

    if(searchValue.length > 2) {
      axios.get('/api/user/patient-crud/search-patient', {
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
      <input className='form-control' type='text' value={query} onChange={handleSearch} placeholder='Search...' />
      
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
                <span>Name: {s.name}</span>
                <br />
                <span>Phone: {s.phone}</span>
              </div>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      <p className='h3 text-center mt-3'>View All Patients</p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show selectedItem if exists, else show listData */}
            {selectedItem ? (
              <tr key={selectedItem.id}>
                <td>1</td>
                <td><img className='userIcon' src={patientIcon} alt='User Icon' style={{ height: '35px', width: '35px' }} /></td>
                <td>{selectedItem.name}</td>
                <td>{selectedItem.age}</td>
                <td>{selectedItem.phone}</td>
                <td>{selectedItem.district}</td>
                <td>
                  <Link to={`/user/view-patient-card/${selectedItem.id}`} className='btn btn-outline-primary btn-sm mx-2'>Full Info </Link>
                  <Link to={`/user/edit-patient/${selectedItem.id}`} className='btn btn-outline-success btn-sm mx-2'>Edit</Link>
                  {
                      (role !== 'lab' && role !== 'hospital') && (
                        <Link to={`/user/assign-patient/${selectedItem.id}`} className='btn btn-outline-success btn-sm mx-2'>
                          Assign Test
                        </Link>
                      )
                    }

                  <Link to={`/user/view-patient-card/${selectedItem.id}`} className='btn btn-outline-primary btn-sm mx-2'>Patient Card</Link>
                  <button className='btn btn-outline-danger btn-sm mx-2'>Disable</button>
                </td>
              </tr>
            ) : (
              listData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><img className='userIcon' src={patientIcon} alt='User Icon' style={{ height: '35px', width: '35px' }} /></td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone}</td>
                  <td>{item.district}</td>
                  <td>
                    <Link to={`/user/view-patient-card/${item.id}`} className='btn btn-outline-primary btn-sm mx-2'>Full Info</Link>
                    <Link to={`/user/edit-patient/${item.id}`} className='btn btn-outline-success btn-sm mx-2'>Edit</Link>
                    
                    {
                      (role !== 'lab' && role !== 'hospital') && (
                        <Link to={`/user/assign-patient/${item.id}`} className='btn btn-outline-success btn-sm mx-2'>
                          Assign Test
                        </Link>
                      )
                    }
       
                    <Link to={`/user/view-patient-card/${item.id}`} className='btn btn-outline-primary btn-sm mx-2'>Patient Card</Link>
                    <button className='btn btn-outline-danger btn-sm mx-2'>Disable</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

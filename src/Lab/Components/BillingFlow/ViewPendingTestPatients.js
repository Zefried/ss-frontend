import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import patientIcon from '../../../assets/img/patient/patient.png';

export const ViewPendingTestPatients = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const role = customStateMethods.selectStateKey('appState', 'role');

  const [query, setQuery] = useState('');
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [token, currentPage, recordsPerPage]); // Add pagination dependencies

  const fetchPatients = () => {
    setLoading(true);
    axios.get('/api/lab/flow/view-pending-patients', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: currentPage,
        recordsPerPage: recordsPerPage,
      },
    })
      .then(response => {
        setListData(response.data.listData || []);
        setTotalRecords(response.data.total || 0); // Set total records for pagination
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      setLoading(true);
      axios.get('/api/lab/flow/search-pending-patients', {
        params: { query: searchValue },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (Array.isArray(res.data?.results)) {
            setSuggestions(res.data.results.map(item => ({
              id: item.patient_data.id,
              name: item.patient_data.name,
              phone: item.patient_data.phone,
              age: item.patient_data.age,
              district: item.patient_data.district,
            })));
          } else {
            setSuggestions([]);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectItem = (selected) => {
    setSelectedItem(selected);
    setQuery('');
    setSuggestions([]);
  };

  // Pagination functions
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleRow = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setRecordsPerPage(value);
      setCurrentPage(1); // Reset to the first page when changing rows per page
    }
  };

  const getPageCount = () => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <input
        className='form-control'
        type='text'
        value={query}
        onChange={handleSearch}
        placeholder='Search...'
      />

      {suggestions.length > 0 && (
        <div className="list-group col-lg-4">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="list-group-item list-group-item-action d-flex align-items-center mt-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectItem(s)}
            >
              <img
                src={patientIcon}
                alt="Patient"
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <div>
                <span>Name: {s.name}</span>
                <br />
                <span>Phone: {s.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className='h3 text-center mt-3'>Patients Data</p>
      <p>Note: These pending patients may have incomplete tests. | Billed in the lab but not completed all tests</p>

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
              {role !== 'admin' && role !== 'user' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {selectedItem ? (
              <tr key={selectedItem.id}>
                <td>1</td>
                <td><img className='userIcon' src={patientIcon} alt='User Icon' style={{ height: '35px', width: '35px' }} /></td>
                <td>{selectedItem.name}</td>
                <td>{selectedItem.age}</td>
                <td>{selectedItem.phone}</td>
                <td>{selectedItem.district}</td>
                {role !== 'admin' && role !== 'user' && (
                  <td>
                    <Link to={`/lab/view-paid-patient-bill/${selectedItem.id}`} className='btn btn-outline-primary btn-sm mx-2'>
                      View Bill
                    </Link>
                  </td>
                )}
              </tr>
            ) : (
              Array.isArray(listData) && listData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td><img className='userIcon' src={patientIcon} alt='User Icon' style={{ height: '35px', width: '35px' }} /></td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone}</td>
                  <td>{item.district}</td>
                  {role !== 'admin' && role !== 'user' && (
                    <td>
                      <Link to={`/lab/view-paid-patient-bill/${item.id}`} className='btn btn-outline-primary btn-sm mx-2'>
                        View Bill
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <select className="form-select" onChange={handleRow} value={recordsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>Previous</button>
            </li>
            {getPageCount().map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(page)}>{page}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(totalRecords / recordsPerPage) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
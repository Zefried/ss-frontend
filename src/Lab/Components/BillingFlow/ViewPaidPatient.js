import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import patientIcon from '../../../assets/img/patient/patient.png';

export const ViewPaidPatient = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  let role = customStateMethods.selectStateKey('appState', 'role');

  // Search and suggestions states
  const [query, setQuery] = useState('');
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected suggestion
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch patients with pagination
  useEffect(() => {
    fetchPatients();
  }, [token, currentPage, recordsPerPage]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/lab/flow/view-paid-patients', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          recordsPerPage: recordsPerPage,
        },
      });

      if (response.data) {
        setListData(response.data.listData || []);
        setTotalRecords(response.data.total || 0);
      } else {
        setError('No data found');
      }
    } catch (error) {
      setError('An error occurred while fetching patients');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 2) {
      setLoading(true);
      axios.get('/api/lab/flow/search-paid-patients', {
        params: { query: searchValue },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          // Extract patient data from each result
          const extractedPatients = res.data?.results?.map(r => r.patient_data) || [];
          setSuggestions(extractedPatients);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelectItem = (selected) => {
    setSelectedItem(selected); // Set the selected item
    setQuery(''); // Clear the search input
    setSuggestions([]); // Clear the suggestions dropdown
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        className='form-control'
        type='text'
        value={query}
        onChange={handleSearch}
        placeholder='Search...'
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="list-group col-lg-4">
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              className="list-group-item list-group-item-action d-flex align-items-center mt-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectItem(s)} // Handle selection
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

      <p className='h3 text-center mt-3'>View Completed Patients</p>

      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Email</th>
              <th>District</th>
              <th>State</th>
              {role !== 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {/* Render selected item if exists, otherwise render the full list */}
            {selectedItem ? (
              <tr key={selectedItem.id}>
                <td>1</td>
                <td>
                  <img
                    className='userIcon'
                    src={patientIcon}
                    alt='User Icon'
                    style={{ height: '35px', width: '35px' }}
                  />
                </td>
                <td>{selectedItem.name}</td>
                <td>{selectedItem.age || 'N/A'}</td>
                <td>{selectedItem.phone}</td>
                <td>{selectedItem.email || 'N/A'}</td>
                <td>{selectedItem.district || 'N/A'}</td>
                <td>{selectedItem.state || 'N/A'}</td>
                {role !== 'admin' && (
                  <td>
                    <Link
                      to={`/lab/view-paid-patient-bill/${selectedItem.id}`}
                      className='btn btn-outline-primary btn-sm mx-2'
                    >
                      View Bill
                    </Link>
                  </td>
                )}
              </tr>
            ) : (
              listData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>
                    <img
                      className='userIcon'
                      src={patientIcon}
                      alt='User Icon'
                      style={{ height: '35px', width: '35px' }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.age || 'N/A'}</td>
                  <td>{item.phone}</td>
                  <td>{item.email || 'N/A'}</td>
                  <td>{item.district || 'N/A'}</td>
                  <td>{item.state || 'N/A'}</td>
                  {role !== 'admin' && (
                    <td>
                      <Link
                        to={`/lab/view-paid-patient-bill/${item.id}`}
                        className='btn btn-outline-primary btn-sm mx-2'
                      >
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
          <select
            className="form-select"
            onChange={handleRow}
            value={recordsPerPage}
          >
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
              <button
                className="page-link"
                onClick={() => handlePageClick(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {getPageCount().map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === Math.ceil(totalRecords / recordsPerPage)
                  ? 'disabled'
                  : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageClick(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
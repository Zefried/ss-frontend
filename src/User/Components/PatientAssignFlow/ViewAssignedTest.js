import React, { useState, useEffect } from 'react';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import axios from 'axios';
import patientIcon from '../../../assets/img/patient/patient.png';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';

export const ViewAssignedTest = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const role = customStateMethods.selectStateKey('appState', 'role');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/user/patient-assign-flow/view-assigned-patients', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: currentPage,
        recordsPerPage: recordsPerPage,
      },
    })
      .then(res => {
        setData(res.data?.data || []);
        setTotalRecords(res.data?.total || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token, currentPage, recordsPerPage]);

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

    if (searchValue.length > 3) {
      axios.get('/api/user/patient-assign-flow/search-assigned-patient', {
        params: { query: searchValue },
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data?.results) {
            setSuggestions(res.data.results);
          } else {
            setSuggestions([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setSuggestions([]);
          setLoading(false);
        });
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  };

  const handleSelectItem = (selected) => {
    setSelectedItem(selected);
    setSuggestions([]);
    setQuery('');
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <p className='h3 text-center mt-3'>View Assigned Patients</p>

      <input
        className='form-control'
        type='text'
        value={query}
        onChange={handleSearch}
        placeholder='Search for the assigned patient, e.g., 9953xxxx. || Type minimum 4 characters'
      />

      {/* Search Suggestions */}
      <div className="list-group col-lg-4">
        {suggestions.length > 0 ? (
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
          query.length > 3 && <p className="text-muted mt-3">No suggestions found.</p>
        )}
      </div>

      {selectedItem ? (
        <div className="card p-3">
          <h4>Selected Patient</h4>
          <p><strong>Name:</strong> {selectedItem.patient_data?.name}</p>
          <p><strong>Age:</strong> {selectedItem.patient_data?.age}</p>
          <p><strong>Phone:</strong> {selectedItem.patient_data?.phone}</p>
          <p><strong>District:</strong> {selectedItem.patient_data?.district}</p>

          <td>
            <button className="btn btn-info btn-sm" onClick={() => handleShowTests(selectedItem.tests)}>View Tests</button>
          </td>

          {role === "admin" && (
            <td>
              <button className="btn btn-info btn-sm mt-3" onClick={() => setSelectedItem(null)}>Back to List</button>
            </td>
          )}

          {(role === 'lab' || role === 'hospital') && (
            <td>
              <Link className="btn btn-info btn-sm mt-3" to={`/lab/billing-step-one/${selectedItem?.patient_id}`}>
                Proceed To Billing
              </Link>
            </td>
          )}
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

      {/* Pagination UI */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <select
            className="form-select"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
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
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: Math.ceil(totalRecords / recordsPerPage) }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(totalRecords / recordsPerPage) ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';




export const ViewAssignedPatient = () => {
    // State Management
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const navigate = useNavigate();


    // Test Modal state
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedPatientTests, setSelectedPatientTests] = useState([]);

    

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Default per page
    const [totalPages, setTotalPages] = useState(1);


    // Data State for Patients
    const [patientsData, setPatientsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [suggestions, setSuggestions] = useState([]); // For storing search suggestions
    const [selected, setSelected] = useState(null); // Selected patient data


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  

    // Fetch Data Logic (Called only on initial load or pagination change)

    useEffect(() => {
        if (!searchQuery) { // Don't fetch if there's an active search query
            fetchAssignedPatients();
        }
    }, [currentPage, recordsPerPage]);


    const fetchAssignedPatients = async () => {
        try {
            setLoading(customStateMethods.spinnerDiv(true));
            const response = await axios.get(`/api/user/fetch-assigned-patient-data?page=${currentPage}&recordsPerPage=${recordsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const { status, listData, message, total, last_page } = response.data;
            if (status === 200) {
                setPatientsData(listData);
                setTotalPages(last_page);
                setMessages(customStateMethods.getAlertDiv(message));
            } else {
                setPatientsData([]);
                setMessages(customStateMethods.getAlertDiv('No data available'));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching assigned patients:", error);
            setLoading(false);
        }
        clearMessages();
    };

    // Handle Clear Messages
    const clearMessages = () => {
        setTimeout(() => {
            setMessages('');
        }, 5000);
    };

    // Search Logic (Doesn't trigger the fetch for patients, only updates the search suggestions)
    const handleSearch = async (e) => {
        setLoading(customStateMethods.spinnerDiv(true));
    
        const searchValue = e.target.value;
        setSearchQuery(searchValue);
    
        if (searchValue.length > 1) {
            try {
                const response = await axios.get(`/api/user/search-patient?query=${searchValue}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Make sure the response contains 'results' and map it to the suggestions state
                if (response.data.results) {
                    setSuggestions(response.data.results);
                } else {
                    setSuggestions([]);
                }
                setMessages(customStateMethods.getAlertDiv(response.data.message));
                setLoading(false);
    
            } catch (error) {
                setLoading(false);
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setLoading(false);
            setSuggestions([]);
        }
    };
    


    // Handle Suggestion Click (Set selected patient and replace the table with selected data)
    const handleSuggestionClick = (patient_id, patient_name, lab_name, employee_name, lab_id, employee_id) => {
        const selectedPatient = { patient_id, patient_name, lab_name, employee_name, lab_id, employee_id };
        setSelected(selectedPatient);  // Set the selected patient data
        setSuggestions([]);  // Clear suggestions
        setSearchQuery('');  // Update the search input with the selected patient name or any other field you prefer
    };

    // Dropdown Handler for records per page
    const handleRecordsPerPageChange = (event) => {
        setRecordsPerPage(parseInt(event.target.value));
        setCurrentPage(1); // Reset to the first page when records per page changes
    };

    // Pagination Handlers
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const getPageCount = () => {
        let pageCount = [];
        for (let i = 1; i <= totalPages; i++) {
            pageCount.push(i);
        }
        return pageCount;
    };


    console.log(selected ? selected : '');

    // Render Selected Patient JSX
    const renderSelectedPatientDetails = () => {
        if (!selected) return null;
    
        return (
            <div className="mt-4">
                <h3 className="mb-4">Selected Patient Details</h3>
                <div className="card shadow-sm p-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Patient Name</th>
                                <th>Lab Name</th>
                                <th>Employee Name</th>
                                <th>Test IDs</th>
                                <th>Re-Assign</th>
                                <th>Full Info</th>
                                <th>Disable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Assuming 'selected' is an object with patient data */}
                            <tr>
                                <td>1</td>
                                <td>{selected.patient_name}</td>
                                <td>{selected.lab_name}</td>
                                <td>{selected.employee_name}</td>
                                
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#testModal"
                                        onClick={() => handleViewTest(selected.patient_id)} 
                                    >
                                        View Test
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-outline-success btn-sm" 
                                        onClick={() => handleReAssign(selected.patient_id, selected.lab_id)} 
                                    >
                                        Re-Assign
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-outline-primary btn-sm">Full Info</button>
                                </td>
                                <td>
                                    <button className="btn btn-outline-danger btn-sm">Disable</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    

    const handleViewTest = (patientId) => {
        const selectedPatient = patientsData.find(patient => patient.id === patientId);
    
        if (selectedPatient && selectedPatient.test_ids) {
            try {
                const testIds = JSON.parse(selectedPatient.test_ids);
                setSelectedPatientTests(testIds); // Set the tests for modal
            } catch (error) {
                console.error("Error parsing test IDs", error);
                setSelectedPatientTests([]); // Set empty if error
            }
            setSelectedPatientId(patientId);  // Set the selected patient ID
            handleShow(); // Show modal
        } else {
            console.log('select item patient id is not showing');
        }
    };
    

    const handleReAssign = (patientId, labId) => {
        navigate('/user/assign-patient-step-two', { state: { patientId, labId } });
        console.log(labId, 'labId');
    };
    

    // render modal view test 
    const testModal = (
        <div className="modal fade" id="testModal" tabIndex={-1} aria-labelledby="testModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="testModalLabel">Test Details</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    
                    <div className="modal-body">
                        {selectedPatientId ? (
                            patientsData
                                .filter(patient => patient.id === selectedPatientId) // Filter by selected patient ID
                                .map((patient, index) => (
                                    <div key={index}>
                                        <h5>{patient.patient_name}'s Tests</h5>
                                        <ul>
                                            {patient.test_ids ? (
                                                (() => {
                                                    try {
                                                        const testIds = JSON.parse(patient.test_ids);
                                                        return testIds.length > 0 ? (
                                                            testIds.map((test, index) => <li key={index}>{test.name}</li>)
                                                        ) : (
                                                            <li>No tests assigned</li>
                                                        );
                                                    } catch (error) {
                                                        return <li>Error loading tests</li>;
                                                    }
                                                })()
                                            ) : (
                                                <li>No test data available</li>
                                            )}
                                        </ul>
                                    </div>
                                ))
                        ) : (
                            <li>No patient selected</li>
                        )}
                    </div>



                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
      
      
    return (
        <div>
            {/* Loading and Messages */}
            {loading}
            {messages}
            {testModal}

            {/* Search Input */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Assigned Patients</h2>

                {/* Search Input */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            placeholder="Search by patient name or phone"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 text-end">
                        <label htmlFor="recordsPerPage" className="me-2">Records per page:</label>
                        <select
                            id="recordsPerPage"
                            value={recordsPerPage}
                            onChange={handleRecordsPerPageChange}
                            className="form-select d-inline w-auto"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                {/* Suggestions */}
                {suggestions && suggestions.length > 0 && (
                    <div className="list-group">
                        {suggestions.map(({ patient_id, patient_name, lab_id, lab_name, employee_name, employee_id }) => (
                            <ul key={patient_id} onClick={() => handleSuggestionClick(patient_id, patient_name, lab_name, employee_name, lab_id, employee_id)} style={{ cursor: 'pointer' }}>
                                <li className="list-group-item">
                                    <strong>Name:</strong> {patient_name} | 
                                    <strong>Lab:</strong> {lab_name} | 
                                    <strong>Employee:</strong> {employee_name}
                                </li>
                            </ul>
                        ))}
                    </div>
                )}



                {/* If no selected patient, show the patient list */}
                {selected ? (
                    renderSelectedPatientDetails()
                ) : (
                    <>
                        {/* Table for Assigned Patients */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>S.No</th>
                                        <th>Patient Name</th>
                                        <th>Lab Name</th>
                                        <th>Employee Name</th>
                                        <th>Discount</th>
                                        <th>Test IDs</th>
                                        <th>Re-Assign</th>
                                        <th>Full Info</th>
                                        <th>Disable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientsData && patientsData.length > 0 ? (
                                        patientsData.map((patient, index) => (
                                            <tr key={patient.id}>
                                                <td>{index + 1}</td>
                                                <td>{patient.patient_name}</td>
                                                <td>{patient.lab_name}</td>
                                                <td>{patient.employee_name}</td>
                                                <td>{patient.discount}%</td>
                                                <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#testModal"
                                                    onClick={() => handleViewTest(patient.id)}
                                                >
                                                    View Test
                                                </button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-success btn-sm' onClick={() => handleReAssign(patient.patient_id, patient.lab_id)}>Re-Assign</button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-primary btn-sm'>Full Info</button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-danger btn-sm'>Disable</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Pagination */}
                {!selected && 
                    (
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>Previous</button>
                            </li>
                            {getPageCount().map(page => (
                                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageClick(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                    )
                }
                
            </div>
        </div>
    );
};

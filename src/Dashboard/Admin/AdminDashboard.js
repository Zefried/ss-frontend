import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { customStateMethods } from '../../StateMng/Slice/AuthSlice'; // Adjust the import path as needed
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
    // State for all data
    const [totalDoctorsAndWorkers, setTotalDoctorsAndWorkers] = useState(0);
    const [totalLabsAndHospitals, setTotalLabsAndHospitals] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalAssignedPatients, setTotalAssignedPatients] = useState(0);
    const [totalBilledPatients, setTotalBilledPatients] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0); // Initialize as a number
    const [totalFilteredPatients, setTotalFilteredPatients] = useState(0); // New state for filtered patients

    // State for filters
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the token from the state
    const token = customStateMethods.selectStateKey('appState', 'token');

    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // Fetch all data (no filter)
    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch total doctors and workers
            const doctorsWorkersResponse = await axios.get('/api/admin/total-doctors-workers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalDoctorsAndWorkers(doctorsWorkersResponse.data.total);

            // Fetch total labs and hospitals
            const labsHospitalsResponse = await axios.get('/api/admin/total-labs-hospitals', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalLabsAndHospitals(labsHospitalsResponse.data.total);

            // Fetch total patients
            const patientsResponse = await axios.get('/api/admin/total-patients', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalPatients(patientsResponse.data.total);

            // Fetch total assigned patients (no filter initially)
            const assignedPatientsResponse = await axios.get('/api/admin/total-assigned-patients', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalAssignedPatients(assignedPatientsResponse.data.total);

            // Fetch total billed patients (no filter initially)
            const billedPatientsResponse = await axios.get('/api/admin/total-billed-patients', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalBilledPatients(billedPatientsResponse.data.total);

            // Fetch total revenue (no filter initially)
            const revenueResponse = await axios.get('/api/admin/total-revenue', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Revenue Response:', revenueResponse.data); // Debugging
            const revenue = parseFloat(revenueResponse.data.total) || 0; // Parse the "total" field
            setTotalRevenue(revenue);

            // Fetch total filtered patients (no filter initially)
            const filteredPatientsResponse = await axios.get('/api/admin/total-filtered-patients', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalFilteredPatients(filteredPatientsResponse.data.total);
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch filtered data (assigned patients, billed patients, revenue, and filtered patients)
    const fetchFilteredData = async () => {
        // Early exit if startDate or endDate is not selected
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.'); // Alert for validation
            setError('Please select both start and end dates.');
            return; // Exit the function early
        }

        setLoading(true); // Set loading state to true
        try {
            // Fetch filtered assigned patients
            const assignedPatientsResponse = await axios.get('/api/admin/total-assigned-patients/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: formatDate(startDate), // Use formatted date
                    end_date: formatDate(endDate), // Use formatted date
                },
            });
            setTotalAssignedPatients(assignedPatientsResponse.data.total);

            // Fetch filtered billed patients
            const billedPatientsResponse = await axios.get('/api/admin/total-billed-patients/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: formatDate(startDate), // Use formatted date
                    end_date: formatDate(endDate), // Use formatted date
                },
            });
            setTotalBilledPatients(billedPatientsResponse.data.total);

            // Fetch filtered revenue
            const revenueResponse = await axios.get('/api/admin/total-revenue/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: formatDate(startDate), // Use formatted date
                    end_date: formatDate(endDate), // Use formatted date
                },
            });
            console.log('Filtered Revenue Response:', revenueResponse.data); // Debugging
            const filteredRevenue = parseFloat(revenueResponse.data.total) || 0; // Parse the "total" field
            setTotalRevenue(filteredRevenue);

            // Fetch filtered patients
            const filteredPatientsResponse = await axios.get('/api/admin/total-filtered-patients', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: formatDate(startDate), // Use formatted date
                    end_date: formatDate(endDate), // Use formatted date
                },
            });
            setTotalFilteredPatients(filteredPatientsResponse.data.total);
        } catch (err) {
            console.error(err);
            alert('An error occurred while fetching filtered data'); // Alert for error handling
            setError('An error occurred while fetching filtered data');
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    // Handle filter button click
    const handleFilter = () => {
        fetchFilteredData();
    };

    // Loading state
    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>;
    }

    // Error state
    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (

        <div className="container mt-5">

            <h1 className="text-center mb-4">Admin Dashboard Overview</h1>
            
            {/* Cards Grouped Together */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
                {/* Card 1: Total Doctors and Workers */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Doctors & Workers</h5>
                            <p className="card-text display-4">{totalDoctorsAndWorkers}</p>
                            <p className="text-muted small">Total doctors and workers registered</p>
                        </div>
                    </div>
                </div>
                
                {/* Card 2: Total Labs & Hospitals */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Labs & Hospitals</h5>
                            <p className="card-text display-4">{totalLabsAndHospitals}</p>
                            <p className="text-muted small">Total labs and hospitals registered</p>
                        </div>
                    </div>
                </div>
                
                {/* Card 3: Total Patients */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Patients</h5>
                            <p className="card-text display-4">{totalPatients}</p>
                            <p className="text-muted small">Total patients registered</p>
                        </div>
                    </div>
                </div>
                
                {/* Card 4: Total Filtered Patients */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Filtered Patients</h5>
                            <p className="card-text display-4">{totalFilteredPatients}</p>
                            <p className="text-muted small">Total patient registered by date range</p>
                        </div>
                    </div>
                </div>
            </div>

            
           {/* Remaining Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
                {/* Card 5: Total Assigned Patients */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Assigned Patients</h5>
                            <p className="card-text fs-3">{totalAssignedPatients}</p>
                            <p className="text-muted small">Total patients assigned to labs/hospitals</p>
                        </div>
                    </div>
                </div>
                
                {/* Card 6: Total Billed Patients */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Billed Patients</h5>
                            <p className="card-text fs-3">{totalBilledPatients}</p>
                            <p className="text-muted small">Total patients billed</p>
                        </div>
                    </div>
                </div>
                
                {/* Card 7: Total Revenue Generated */}
                <div className="col">
                    <div className="card shadow-sm text-center h-100">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">Total Revenue Generated</h5>
                            <p className="card-text fs-3 text-truncate">₹{(totalRevenue || 0).toFixed(2)}</p>
                            <p className="text-muted small">Total revenue generated from billing</p>
                        </div>
                    </div>
                </div>

            </div>

            
            {/* Date Filter Section */}
            <div className="row mb-4">
                <div className="col-lg-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Filter by Date Range</h5>
                            <div className="d-flex flex-column flex-md-row gap-3">
                                <div>
                                    <label>Start Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label>End Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        className="form-control"
                                    />
                                </div>
                                <button
                                    className="btn btn-primary align-self-end"
                                    onClick={handleFilter}
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-4 mt-4">
                <h3 className="mb-3">Additional Important Reports</h3>
                <p className="mb-2"> <b>Check the total revenue generated by labs within the selected date range.</b></p>
                <Link to={'/admin/lab-revenue'} className="btn btn-outline-info btn-md">
                    View Report
                </Link>

                <p className="mb-2 mt-2"> <b>Check the total revenue generated by lab employees within the selected date range.</b></p>
                <Link to={'/admin/lab-employee-revenue'} className="btn btn-outline-info btn-md">
                    View Report
                </Link>
            </div>

        </div>
    
    );
};
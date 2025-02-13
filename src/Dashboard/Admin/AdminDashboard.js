import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { customStateMethods } from '../../StateMng/Slice/AuthSlice'; // Adjust the import path as needed

export const AdminDashboard = () => {
    // State for all data
    const [totalDoctorsAndWorkers, setTotalDoctorsAndWorkers] = useState(0);
    const [totalLabsAndHospitals, setTotalLabsAndHospitals] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalAssignedPatients, setTotalAssignedPatients] = useState(0);
    const [totalBilledPatients, setTotalBilledPatients] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0); // Initialize as a number

    // State for filters
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the token from the state
    const token = customStateMethods.selectStateKey('appState', 'token');

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
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch filtered data (assigned patients, billed patients, and revenue)
    const fetchFilteredData = async () => {
        setLoading(true);
        try {
            if (!startDate || !endDate) {
                setError('Please select both start and end dates.');
                return;
            }

            // Fetch filtered assigned patients
            const assignedPatientsResponse = await axios.get('/api/admin/total-assigned-patients/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                },
            });
            setTotalAssignedPatients(assignedPatientsResponse.data.total);

            // Fetch filtered billed patients
            const billedPatientsResponse = await axios.get('/api/admin/total-billed-patients/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                },
            });
            setTotalBilledPatients(billedPatientsResponse.data.total);

            // Fetch filtered revenue
            const revenueResponse = await axios.get('/api/admin/total-revenue/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                },
            });
            console.log('Filtered Revenue Response:', revenueResponse.data); // Debugging
            const filteredRevenue = parseFloat(revenueResponse.data.total) || 0; // Parse the "total" field
            setTotalRevenue(filteredRevenue);
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching filtered data');
        } finally {
            setLoading(false);
        }
    };

    // Handle filter button click
    const handleFilter = () => {
        fetchFilteredData();
    };

    // Loading state
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    // Error state
    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row mb-4">
            <h1 className="text-center mb-4">Admin Dashboard Overview</h1>
                {/* Card 1: Total Doctors and Workers */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Doctors & Workers</h5>
                            <p className="card-text display-4">{totalDoctorsAndWorkers}</p>
                            <p className="text-muted">Total doctors and workers registered</p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Labs & Hospitals */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Labs & Hospitals</h5>
                            <p className="card-text display-4">{totalLabsAndHospitals}</p>
                            <p className="text-muted">Total labs and hospitals registered</p>
                        </div>
                    </div>
                </div>

                {/* Card 3: Total Patients */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Patients</h5>
                            <p className="card-text display-4">{totalPatients}</p>
                            <p className="text-muted">Total patients registered</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                {/* Card 4: Total Assigned Patients */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Assigned Patients</h5>
                            <p className="card-text display-4">{totalAssignedPatients}</p>
                            <p className="text-muted">Total patients assigned to labs/hospitals</p>
                        </div>
                    </div>
                </div>

                {/* Card 5: Total Billed Patients */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Billed Patients</h5>
                            <p className="card-text display-4">{totalBilledPatients}</p>
                            <p className="text-muted">Total patients billed</p>
                        </div>
                    </div>
                </div>

                {/* Card 6: Total Revenue Generated */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Revenue Generated</h5>
                            <p className="card-text display-4">{(totalRevenue || 0).toFixed(2)}</p>
                            <p className="text-muted">Total revenue generated from billing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Filter Section */}
            <div className="row mb-4">
                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Filter by Date Range</h5>
                            <div className="d-flex gap-3">
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
        </div>
    );
};
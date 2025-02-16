import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const AdminLabEmployeeRevenue = () => {
    const token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [labData, setLabData] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [revenue, setRevenue] = useState(null); // State to store revenue data

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/admin/lab/fetch-lab-account-data', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setLabData(response.data.listData);
                } else {
                    setError('No labs found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const labEmployees = async (labId) => {
        console.log(`Fetching employees for Lab ID: ${labId}`);
        try {
            const response = await axios.post(
                `/api/admin/employee/fetch-specific-lab-employees`,
                { id: labId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmployees(response.data.listData);
        } catch (err) {
            console.error('Error fetching lab employees:', err.response?.data?.message || err.message);
            setEmployees([]);
        }
    };

    const fetchLabRevenueByEmployee = async () => {
        if (!selectedLab || !selectedEmployee || !startDate || !endDate) {
            alert("Please select all fields before submitting.");
            return;
        }
    
        const params = new URLSearchParams({
            lab_id: selectedLab,
            employee_id: selectedEmployee,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
        }).toString();
    
        try {
            const response = await axios.get(
                `/api/admin/total-revenue-by-lab-employee/filter?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Store the revenue in state
            setRevenue(response.data.data.total_revenue);
    
            console.log("Revenue Data:", response.data);

        } catch (err) {
            console.error("Error fetching revenue data:", err.response?.data?.message || err.message);
            alert("Failed to fetch revenue data.");
        }
    };

    return (

        <div className="container mt-4">
            <h2 className="text-center mb-3">Revenue Report Against Employees</h2>
        
                {loading && (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-grow text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
        
                {error && <p className="text-danger text-center">{error}</p>}
    
            {/* Form */}
            <div className="card p-3 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Select Lab:</label>
                    <select
                        className="form-select"
                        onChange={(e) => {
                            setSelectedLab(e.target.value);
                            labEmployees(e.target.value);
                        }}
                        value={selectedLab || ""}
                    >
                        <option value="" disabled>Select a lab</option>
                        {labData.map((lab) => (
                            <option key={lab.id} value={lab.id}>
                                {lab.name}
                            </option>
                        ))}
                    </select>
                </div>
    
                {employees.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label">Select Employee:</label>
                        <select
                            className="form-select"
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            value={selectedEmployee || ""}
                        >
                            <option value="" disabled>Select an employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
        
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Start Date:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
        
                    <div className="col-md-6 mb-3">
                        <label className="form-label">End Date:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
                </div>
        
                <button className="btn btn-primary w-100" onClick={fetchLabRevenueByEmployee}>
                    Fetch Revenue
                </button>

            </div>
    
            {/* Revenue Card (Always Visible) */}
            <div className="card mt-4 p-3 text-center shadow-sm">
                <h4 className="mb-2">Revenue Details</h4>
                <p className="fs-5"><strong>Total Revenue:</strong> ₹ {revenue}</p>
            </div>
        </div>
    
    );
};

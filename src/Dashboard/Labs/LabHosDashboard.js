import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../StateMng/Slice/AuthSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const LabHosDashboard = () => {
    const [totalBillCount, setTotalBillCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [employeeRevenue, setEmployeeRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]); // State to store the list of employees
    const token = customStateMethods.selectStateKey('appState', 'token');

    // Utility function to adjust dates to Kolkata timezone (UTC+5:30)
    const adjustToKolkataTimezone = (date) => {
        if (!date) return null;

        // Get the timezone offset for Kolkata (UTC+5:30) in milliseconds
        const kolkataOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds

        // Adjust the date to Kolkata timezone
        const kolkataDate = new Date(date.getTime() + kolkataOffset);

        return kolkataDate;
    };

    // Utility function to format dates as YYYY-MM-DD
    const formatDateForPayload = (date) => {
        if (!date) return null;

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchBillingCount();
        fetchTotalRevenue();
        fetchLabEmployees(); // Fetch the list of employees when the component mounts
    }, [token]);

    // Fetch the list of employees associated with the lab
    const fetchLabEmployees = async () => {
        try {
            const response = await axios.get('/api/admin/employee/fetch-lab-employee', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
                setEmployees(response.data.listData || []); // Use `listData` from the response
            } else {
                setError(response.data.message || 'Failed to fetch employees');
            }
        } catch (err) {
            console.error('Error fetching employees:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred while fetching employees');
        }
    };

    // Fetch total billing count
    const fetchBillingCount = async (startDate = null, endDate = null) => {
        setLoading(true);
        try {
            let url = '/api/report/lab/patient-billing';
            if (startDate && endDate) {
                url = '/api/report/lab/patient-billing/filter';
                const formattedStartDate = formatDateForPayload(adjustToKolkataTimezone(startDate));
                const formattedEndDate = formatDateForPayload(adjustToKolkataTimezone(endDate));
                url += `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
                setTotalBillCount(response.data.total);
            } else {
                setError(response.data.message || 'Failed to fetch billing count');
            }
        } catch (err) {
            console.error('Error fetching billing count:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred while fetching billing count');
        } finally {
            setLoading(false);
        }
    };

    // Fetch total revenue
    const fetchTotalRevenue = async (startDate = null, endDate = null) => {
        setLoading(true);
        try {
            let url = '/api/report/lab/total-revenue';
            if (startDate && endDate) {
                url = '/api/report/lab/total-revenue/filter';
                const formattedStartDate = formatDateForPayload(adjustToKolkataTimezone(startDate));
                const formattedEndDate = formatDateForPayload(adjustToKolkataTimezone(endDate));
                url += `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
                const revenue = parseFloat(response.data.total) || 0;
                setTotalRevenue(revenue);
            } else {
                setError(response.data.message || 'Failed to fetch total revenue');
            }
        } catch (err) {
            console.error('Error fetching total revenue:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred while fetching total revenue');
        } finally {
            setLoading(false);
        }
    };

    // Fetch revenue for the selected employee within the date range
    const fetchEmployeeRevenue = async () => {
        if (!employeeId) {
            setError('Please select an employee.');
            return;
        }

        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        setLoading(true);
        try {
            const formattedStartDate = formatDateForPayload(adjustToKolkataTimezone(startDate));
            const formattedEndDate = formatDateForPayload(adjustToKolkataTimezone(endDate));
            const url = `/api/report/lab/employee-revenue/filter?employee_id=${employeeId}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
                const revenue = parseFloat(response.data.total) || 0;
                setEmployeeRevenue(revenue);
            } else {
                setError(response.data.message || 'Failed to fetch employee revenue');
            }
        } catch (err) {
            console.error('Error fetching employee revenue:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred while fetching employee revenue');
        } finally {
            setLoading(false);
        }
    };

    // Handle employee selection
    const handleEmployeeChange = (e) => {
        setEmployeeId(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchEmployeeRevenue();
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <h1 className="text-center mb-4">Lab || Hospital Dashboard Overview</h1>
                {/* Card for Total Billing Count */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Billing Count</h5>
                            <p className="card-text display-4">{totalBillCount}</p>
                            <p className="text-muted">Total bills processed by the lab</p>
                        </div>
                    </div>
                </div>

                {/* Card for Total Revenue */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Total Revenue Generated</h5>
                            <p className="card-text display-4">{(totalRevenue || 0).toFixed(2)}</p>
                            <p className="text-muted">Total revenue generated by the lab</p>
                        </div>
                    </div>
                </div>

                {/* Card for Employee Revenue */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title text-primary">Employee Revenue</h5>
                            <p className="card-text display-4">{(employeeRevenue || 0).toFixed(2)}</p>
                            <p className="text-muted">Revenue generated by the selected employee</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee and Date Filter Section */}
            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Filter by Employee and Date Range</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex gap-3">
                                    <div>
                                        <label>Select Employee</label>
                                        <select
                                            className="form-control"
                                            value={employeeId}
                                            onChange={handleEmployeeChange}
                                            required
                                        >
                                            <option value="">Select an employee</option>
                                            {(employees || []).map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(adjustToKolkataTimezone(date))}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(adjustToKolkataTimezone(date))}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary align-self-end"
                                    >
                                        Apply Filter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
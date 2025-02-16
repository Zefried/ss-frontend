import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const AdminLabRevenue = () => {
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = customStateMethods.selectStateKey('appState', 'token');

    useEffect(() => {
        fetchLabs();
    }, []);

    const fetchLabs = async () => {
        try {
            const response = await axios.get('/api/admin/lab/fetch-lab-account-data', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.listData) {
                setLabs(response.data.listData);
            } else {
                setError('No labs found');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch labs');
        }
    };

    const fetchRevenue = async () => {
        if (!selectedLab || !startDate || !endDate) {
            alert('Please select a lab, start date, and end date.');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.get('/api/admin/total-revenue-by-lab/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    lab_id: selectedLab.id,
                    start_date: new Date(startDate.getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                    end_date: new Date(endDate.getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                },
            });
            setTotalRevenue(parseFloat(response.data.data.total_revenue) || 0);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch revenue data');
        } finally {
            setLoading(false);
        }
    };

    const handleLabChange = (event) => {
        const labId = parseInt(event.target.value, 10);
        const lab = labs.find((lab) => lab.id === labId);
        setSelectedLab(lab);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchRevenue();
    };

    return (
    <div className="container mt-5">
        <h1 className="text-center mb-4">Lab Revenue Report</h1>
    
                <div className="row mb-4">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Select Lab</h5>
                                <select
                                    className="form-select mb-3"
                                    onChange={handleLabChange}
                                    value={selectedLab ? selectedLab.id : ''}
                                >
                                    <option value="" disabled>Choose a lab</option>
                                    {labs.map((lab) => (
                                        <option key={lab.id} value={lab.id}>{lab.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="row mb-4">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Select Date Range</h5>
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <div className="w-100">
                                        <label>Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select start date"
                                        />
                                    </div>
                                    <div className="w-100">
                                        <label>End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select end date"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="row mb-4">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={!selectedLab || !startDate || !endDate || loading}>
                            {loading ? 'Loading...' : 'Get Revenue'}
                        </button>
                    </div>
                </div>
            
                <div className="row mb-4">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <h5 className="card-title text-primary">Total Revenue</h5>
                                <p className="card-text display-4">₹{totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            
                {error && (
                    <div className="row mb-4">
                        <div className="col-12 col-md-8 col-lg-6 mx-auto">
                            <div className="alert alert-danger text-center">{error}</div>
                        </div>
                    </div>
                )}
    </div>
    
    );
};

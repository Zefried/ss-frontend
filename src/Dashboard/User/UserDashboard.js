import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { customStateMethods } from '../../StateMng/Slice/AuthSlice';

export const UserDashboard = () => {
  const token = customStateMethods.selectStateKey('appState', 'token');
  const [totalAssignedPatients, setTotalAssignedPatients] = useState(0);
  const [totalBilledPatients, setTotalBilledPatients] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchRevenue = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const revenueResponse = await axios.get('api/workers/total-revenue', { params, ...config });
      const revenue = parseFloat(revenueResponse.data.total);
      setTotalRevenue(isNaN(revenue) ? 0 : revenue);
    } catch (err) {
      setError('Failed to fetch revenue data.');
      console.error('Error fetching revenue:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const assignedPatientsResponse = await axios.get('api/workers/total-assigned-patients', config);
        setTotalAssignedPatients(assignedPatientsResponse.data.total);

        const billedPatientsResponse = await axios.get('api/workers/total-billed-patients', config);
        setTotalBilledPatients(billedPatientsResponse.data.total);

        await fetchRevenue();

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Dashboard</h1>

      <div className="row mb-3">
        <h4>Filter Revenue</h4>
        <div className="col-12 col-md-5 mb-2">
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-12 col-md-5 mb-2">
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchRevenue}>Filter</button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Assigned Patients</h5>
              <p className="card-text display-4">{totalAssignedPatients}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Billed Patients</h5>
              <p className="card-text display-4">{totalBilledPatients}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Revenue</h5>
              <p className="card-text display-4">{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

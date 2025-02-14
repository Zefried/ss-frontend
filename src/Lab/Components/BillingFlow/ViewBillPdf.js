import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const ViewBillPdf = () => {
  const { id } = useParams();
  const token = customStateMethods.selectStateKey('appState', 'token');
  const [billData, setBillData] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillData();
    fetchPatientData();
  }, [id]);

  const fetchBillData = async () => {
    setLoadingBill(true);
    try {
      const response = await axios.get(`/api/lab/flow/view-patient-bill/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBillData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bill data.');
    } finally {
      setLoadingBill(false);
    }
  };

  const fetchPatientData = async () => {
    setLoadingPatient(true);
    try {
      const response = await axios.get(`/api/lab/flow/view-patient/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch patient data.');
    } finally {
      setLoadingPatient(false);
    }
  };

  // Helper function to format date as "Month Day, Year" (e.g., "Feb 12, 2025")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Function to handle printing a bill
  const handlePrintBill = (bill) => {
    const printContent = `
      <div class="container">
        <div class="text-center mb-4">
          <h2 class="text-primary">Invoice</h2>
          <p class="text-muted">Generated on: ${formatDate(new Date())}</p>
        </div>
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h4 class="card-title text-primary">Bill Details</h4>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Bill ID:</strong> ${bill.id}</p>
                <p><strong>Invoice No:</strong> ${bill.transaction_id}</p>
                <p><strong>Created At:</strong> ${formatDate(bill.created_at)}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Final Amount:</strong> ${bill.final_amount}</p>
                <p><strong>Discount:</strong> ${bill.discount}%</p>
                <p><strong>Tests:</strong> ${bill.tests.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h4 class="card-title text-primary">Lab & Employee Details</h4>
            <p><strong>Lab Name:</strong> ${patientData.data.employeeData[0].lab_name}</p>
            <p><strong>Employee Name:</strong> ${patientData.data.employeeData[0].name}</p>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body">
            <h4 class="card-title text-primary">Patient Details</h4>
            <p><strong>Patient Name:</strong> ${patientData.data.patient.name}</p>
            <p><strong>Phone:</strong> ${patientData.data.patient.phone}</p>
            <p><strong>Patient Card ID:</strong> ${patientData.data.patient_card_id}</p>
          </div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; }
            .card { border: none; }
            .card-title { font-size: 1.25rem; font-weight: bold; }
            .text-primary { color: #0d6efd; }
            .text-muted { color: #6c757d; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Function to handle viewing the bill file
  const handleViewFile = (filePath) => {
    const fileUrl = `http://localhost:8000/storage/${filePath}`; // Replace with your server URL
    const newWindow = window.open(fileUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      alert('Unable to open the file. Please check the file path or your network connection.');
    }
  };

  if (loadingBill || loadingPatient) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h3 className="text-primary mb-4 text-center">Patient Details</h3>
      {patientData ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <p><strong>Patient Name:</strong> {patientData.data.patient.name}</p>
            <p><strong>Phone:</strong> {patientData.data.patient.phone}</p>
            <p><strong>Patient Card ID:</strong> {patientData.data.patient_card_id}</p>
          </div>
        </div>
      ) : (
        <p className="text-muted text-center">No patient data found.</p>
      )}
    
      <h3 className="text-primary mb-4 mt-5 text-center">Patient Bill Details</h3>
      {billData.length > 0 ? (
        billData.map((bill) => (
          <div key={bill.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <p><strong>Bill ID:</strong> {bill.id}</p>
                  <p><strong>Invoice No:</strong> {bill.transaction_id}</p>
                  <p><strong>Created At:</strong> {formatDate(bill.created_at)}</p>
                </div>
                <div className="col-12 col-md-6">
                  <p><strong>Final Amount:</strong> {bill.final_amount}</p>
                  <p><strong>Discount:</strong> {bill.discount}%</p>
                  <p><strong>Tests:</strong> {bill.tests.join(', ')}</p>
                </div>
              </div>
              <div className="mt-3">
                <p><strong>Lab Name:</strong> {patientData?.data.employeeData[0].lab_name}</p>
                <p><strong>Employee Name:</strong> {patientData?.data.employeeData[0].name}</p>
              </div>
              <div className="d-grid gap-2 d-md-flex mt-3">
                <button className="btn btn-primary w-100" onClick={() => handlePrintBill(bill)}>
                  Print Bill
                </button>
                <button className="btn btn-secondary w-100" onClick={() => handleViewFile(bill.bill_file)}>
                  View Bill File
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted text-center">No bill data found.</p>
      )}
    </div>
  
  );
};
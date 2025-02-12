import React, { useEffect, useState } from "react";
import axios from "axios";
import { customStateMethods } from "../../../StateMng/Slice/AuthSlice";
import { useParams } from "react-router-dom";

export const BillingStepOne = () => {
  const { id } = useParams();
  const token = customStateMethods.selectStateKey("appState", "token");

  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [testOptions, setTestOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`/api/lab/flow/view-patient/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const patient = response.data?.data;
        if (patient) {
          setPatientData(patient);
          const billableTests = patient?.tests?.tests?.filter((test) => test.billable) || [];
          setTestOptions(patient?.tests?.tests || []);
          setSelectedTests(billableTests.map((test) => test.id));
          setDiscount(patient?.tests?.discount || 0);
        }
      } catch (error) {
        alert(error.response?.data?.message || "Error fetching patient data");
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, token]);

  useEffect(() => {
    const calculatedFinalAmount = amount ? amount - (amount * (discount / 100)) : 0;
    setFinalAmount(calculatedFinalAmount);
  }, [amount, discount]);

  const handleTestSelection = (testId) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!amount || !selectedTests.length || !selectedEmployee) {
      alert("Please enter amount, select at least one test, and choose an employee.");
      return;
    }

    const formData = new FormData();
    formData.append("patient_id", id);
    formData.append("associated_user_id", patientData?.patient?.associated_user_id);
    formData.append("final_amount", finalAmount);
    formData.append("discount", discount);
    formData.append("selected_employee", selectedEmployee);
    selectedTests.forEach((testId) => formData.append("selected_tests[]", testId));
    if (file) formData.append("file", file);

    try {
      await axios.post("/api/lab/flow/submit-billing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Billing submitted successfully!");
    } catch (error) {
      console.error("Error submitting billing:", error);
      alert("Failed to submit billing.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!patientData) return <p>We cannot proceed further. Please add a lab employee first.</p>;

  return (
    <div className="container mt-4">
      <h3 className="text-center">Billing Step One</h3>

      <div className="card p-3 mb-4">
        <h5>Patient Details</h5>
        <p><strong>Name:</strong> {patientData?.patient?.name || "N/A"}</p>
        <p><strong>Phone:</strong> {patientData?.patient?.phone || "N/A"}</p>
        <p><strong>Card ID:</strong> {patientData?.patient_card_id || "N/A"}</p>
      </div>

      <div className="card p-3 mb-4">
        <h5>Assign Lab Employee</h5>
        <select className="form-control" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
          <option value="">Select Employee</option>
          {patientData?.employeeData?.map((employee) => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>

      <div className="card p-3 mb-4">
        <h5>Select Tests</h5>
        {testOptions.map((test) => (
          <div key={test.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`test-${test.id}`}
              checked={selectedTests.includes(test.id)}
              onChange={() => handleTestSelection(test.id)}
            />
            <label className="form-check-label" htmlFor={`test-${test.id}`}>{test.name}</label>
          </div>
        ))}
      </div>

      <div className="card p-3">
        <h5>Billing Details</h5>
        <label className="form-label">Enter Amount:</label>
        <input type="number" className="form-control mb-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter total amount" />

        <label className="form-label">Discount Applied (%):</label>
        <input type="number" className="form-control mb-2" value={discount} onChange={(e) => setDiscount(e.target.value)} />

        <label className="form-label">Final Amount After Discount:</label>
        <input type="number" className="form-control mb-2" value={finalAmount} readOnly />

        <label className="form-label">Upload File (Optional):</label>
        <input type="file" className="form-control mb-2" onChange={handleFileChange} />

        <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit Billing</button>
      </div>
    </div>
  );
};

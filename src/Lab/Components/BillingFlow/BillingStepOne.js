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
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Selected employee state
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");

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
          setSelectedTests(patient?.tests?.tests || []);
          setDiscount(patient?.tests?.discount || 0);
        }



      } catch (error) {
        alert(error.response.data.message);
        console.error("Error fetching patient data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, token]);

  const handleTestSelection = (testId) => {
    setSelectedTests((prevTests) =>
      prevTests.some((test) => test.id === testId)
        ? prevTests.filter((test) => test.id !== testId)
        : [...prevTests, patientData?.tests?.tests?.find((t) => t.id === testId)]
    );
  };

  const calculateFinalAmount = (amountValue, discountValue) => {
    if (!amountValue) return "";
    return (amountValue - (amountValue * discountValue) / 100).toFixed(2);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setFinalAmount(calculateFinalAmount(value, discount));
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscount(value);
    setFinalAmount(calculateFinalAmount(amount, value));
  };

  const handleSubmit = async () => {
    if (!amount || !selectedTests.length || !selectedEmployee) {
      alert("Please enter amount, select at least one test, and choose an employee.");
      return;
    }

    const payload = {
      patient_id: id,
      associated_user_id: patientData?.patient?.associated_user_id,
      selected_tests: selectedTests.map((test) => test.id),
      final_amount: finalAmount,
      discount: discount,
      selected_employee: selectedEmployee, // Include selected employee
    };

    console.log(payload);

    try {
      await axios.post("/api/lab/flow/submit-billing", payload, {
        headers: {
          "Content-Type": "application/json",
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

  if (!patientData) {
    return <p>We cannot proceed further. Please add a lab employee first.</p>;
  }

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
        <h5>Assigned Tests</h5>
        {patientData?.tests?.tests?.length ? (
          patientData.tests.tests.map((test) => (
            <div key={test.id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`test-${test.id}`}
                checked={selectedTests.some((t) => t.id === test.id)}
                onChange={() => handleTestSelection(test.id)}
              />
              <label className="form-check-label" htmlFor={`test-${test.id}`}>
                {test.name}
              </label>
            </div>
          ))
        ) : (
          <p>No assigned tests found.</p>
        )}
      </div>

      <div className="card p-3 mb-4">
        <h5>Assign Lab Employee</h5>
        <select
          className="form-control"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {patientData?.employeeData?.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-3">
        <h5>Billing Details</h5>
        <label className="form-label">Enter Amount:</label>
        <input
          type="number"
          className="form-control mb-2"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter total amount"
        />

        <label className="form-label">Discount Applied (%):</label>
        <input
          type="number"
          className="form-control mb-2"
          value={discount}
          onChange={handleDiscountChange}
        />

        <label className="form-label">Final Amount After Discount:</label>
        <input
          type="number"
          className="form-control mb-2"
          value={finalAmount}
          readOnly
        />

        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          Submit Billing
        </button>
      </div>
    </div>
  );
};

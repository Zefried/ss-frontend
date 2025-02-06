import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const AssignPatientStepTwo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId, labId } = location.state || {};  

    
    // Additional State starts from here
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    // ends here

    // lab, patient name & employee state
    const [name, setName] = useState('');
    const [employee, setEmployee] = useState('');
    // ends here


    // selected Employee Data
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    // ends here




    /// useEffect starts here

        ////// fetching patient name and lab name for process clarity 
        useEffect(() => {
        
          try {
              setLoading(customStateMethods.spinnerDiv(true));

              axios.get('sanctum/csrf-cookie').then(response => {
                  axios.get(`/api/user/fetch-lab-patient-name/?patient_id=${patientId}&labId=${labId}`, {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      }
                  })
                      .then((res) => {

                          if (res.data.status === 200) {
                              setName(res.data);
                              setMessages(customStateMethods.getAlertDiv(res.data.message));
                          } else if(res.data.status === 204) {
                            
                          } else{
                              setMessages(customStateMethods.getAlertDiv(res.data.message));
                          }
                          setLoading(false);
                      })
                      .catch(error => {
                        setLoading(false);
                        console.log(error);
                      });;
              });
          } catch (error) {
              setLoading(false);
              console.log(error);
          }

          // fetching lab associated employee 
          try {
            setLoading(customStateMethods.spinnerDiv(true));

            axios.get('sanctum/csrf-cookie').then(response => {
                axios.get(`/api/user/fetch-lab-associated-employee/?labId=${labId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then((res) => {

                        if (res.data.status === 200) {
                            setEmployee(res.data.employeeData);
                            setMessages(customStateMethods.getAlertDiv(res.data.message));
                        } else if(res.data.status === 204) {
                          
                        } else{
                            setMessages(customStateMethods.getAlertDiv(res.data.message));
                        }
                        setLoading(false);
                    })
                    .catch(error => {
                      setLoading(false);
                      console.log(error);
                  });;
            });
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

      }, []);
        ////// ends here

    /// ends here



    // component functions starts here

      //// This function is used to iterate over res.data and set the selected employee
      const handleEmployeeSelect = (event) => {
        const employeeId = parseInt(event.target.value, 10);
        const selected = employee.find(emp => emp.id === employeeId);
        setSelectedEmployee(selected);
      };
      //// ends here


      //// This function is used to pass the data to next component 
      const handleProceed = () => {
        navigate('/user/assign-patient-step-three', {
            state: {
                patientId,
                labId,
                selectedEmployeeId: selectedEmployee ? selectedEmployee.id : null,
                selectedEmployeeData: selectedEmployee,
                patientData: name, // Assuming `name` holds patient and lab details
            }
        });
      };
      //// ends here

    // component functions ends here

  
    



    
    const selectEmployee = employee.length ? (
      <div className="mb-3">
          <label htmlFor="employeeSelect" className="form-label"></label>
          <select id="employeeSelect" className="form-select col-lg-5 mt-2" onChange={handleEmployeeSelect}>
              <option value="">Select Employee</option>
              {employee.map(emp => (
                  <option key={emp.id} value={emp.id}>
                      {emp.name}
                  </option>
              ))}
          </select>
      </div>
  ) : '';

  const selectedEmployeeJsx = selectedEmployee && (
      <div className="card mt-3">
          <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Selected Employee Details</h5>
          </div>
          <div className="card-body">
              <table className="table table-bordered">
                  <tbody>
                      <tr>
                          <th scope="row">Name</th>
                          <td>{selectedEmployee.name}</td>
                      </tr>
                      <tr>
                          <th scope="row">ID</th>
                          <td>{selectedEmployee.id}</td>
                      </tr>
                      <tr>
                          <th scope="row">Phone</th>
                          <td>{selectedEmployee.phone}</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

    ////// Patient assigning process selected records names 
    const dataName = name && name.labName && labId ? (
      <div>
        
        <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center">
                <h3>Assigning Patient in Progress</h3>
            </div>

            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-secondary">Patient Name</h5>
                        <p className="fs-5 text-dark fw-semibold"> {name.patient_name || "Patient Name Not Available"}</p>
                    </div>
                    <div className="col-md-6">
                        <h5 className="text-secondary">Lab Name</h5>
                        <p className="fs-5 text-dark fw-semibold">    {name.labName || "Lab Name Not Available"}</p>
                    </div>
                </div>

                {selectedEmployee && (
                    <div className="row mt-1">
                        <div className="col-md-6">
                            <h5 className="text-secondary">Employee Name</h5>
                            <p className="fs-5 text-dark fw-semibold">{selectedEmployee.name}</p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-secondary">Employee Phone</h5>
                            <p className="fs-5 text-dark fw-semibold">{selectedEmployee.phone}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    ) : '';
    ////// ends here


  return (
    <div>
      {loading}
      {messages}

      {/* Patient name and lab name from the previous selection in the patient assignment process, rendering JSX */}
      <div className="container my-5">
        {dataName}

        {selectEmployee}
        {selectedEmployeeJsx}

        <div className="card-footer text-center bg-light">
             <button 
                    className="btn btn-primary px-4" 
                    onClick={handleProceed} 
                    disabled={!selectedEmployee} // disable until an employee is selected
              > Proceed To Next Step | Selecting Tests </button>
        </div>

      </div>
      {/* ends here */}

     
    </div>
  )
}

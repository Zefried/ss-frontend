import React, { useState, useEffect } from 'react';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import labIcon from '../../../assets/img/lab/labIcon.jpg'; 

export const AssigningTest = () => {
    // Additional State starts from here
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const navigate = useNavigate();

    // Search Module state starts from here
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState([]);  // Keep selected as an array to accumulate selections
    const [selectedTest, setSelectedTest] = useState([]); // State to store selected test items
    // ends here

    // Importing patient id
    const { id } = useParams();
    const patientId = id;
    // ends here


    // patient card data starts here
    const [patientData, setPatientData] = useState(null);

    useEffect(() => {

        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`/api/user/patient-crud/view-patient-card/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const patient = response.data.patientCountData[0]?.patient_data; // Accessing patient data
                if (patient) {
                    setPatientData(patient);
                    console.log("Patient Data:", patient); // Log the patient data
                } else {
                    console.error('Patient data not found in response');
                }
            } catch (error) {
                console.error('Error fetching patient data:', error); // Log the error if any
            }
        };

        fetchPatientData();
        
    }, [patientId]);
    
    console.log(patientData);
    // patient card data ends here


    /////// Search Module Functions starts from here
    const handleSearch = async (e) => {
        setLoading(customStateMethods.spinnerDiv(true));

        const searchValue = e.target.value;
        setQuery(searchValue);

        // Fetching suggestions from the API
        if (searchValue.length > 1) {
            try {
                const response = await axios.get(`/api/user/patient-assign-flow/searching/test/?query=${searchValue}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSuggestions(response.data.suggestions);
                setMessages(customStateMethods.getAlertDiv(response.data.message));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setLoading(false);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (id, name) => {
        // Accumulate selected items, adding the new one to selected state
        setSelected((prevSelected) => [...prevSelected, { id, name }]);

        setQuery(''); // Updating the input field with the selected name
        setSuggestions([]); // Clearing suggestions
    };

    const handleCheckboxChange = (item) => {
        // Check if item is already in selectedTest, and toggle it
        setSelectedTest((prevTest) => {
            const isSelected = prevTest.some((test) => test.id === item.id);

            if (isSelected) {
                // Remove the item from selectedTest if it's already selected
                return prevTest.filter((test) => test.id !== item.id);
            } else {
                // Add the item to selectedTest
                return [...prevTest, item];
            }
        });
    };

    //////// Search Module Custom JSX starts from here
    let userCard = '';
    let suggestionJSX = '';

    if (suggestions && suggestions.length > 0) {
        userCard = suggestions.map(({ id, name }) => (
            <ul className="row list-group" key={id} onClick={() => handleSuggestionClick(id, name)} style={{ cursor: 'pointer' }}>
                <li className="list-group-item col-md-6 text-dark mt-3 mx-4">
                    <strong>Name:</strong> {name}
                </li>
            </ul>
        ));
    }

    // handling suggestion clearing
    if (selected.length === 0) {
        suggestionJSX = <p className="m-3 mx-4 text-dark">No Suggestions...</p>;
    } else {
        suggestionJSX = '';
    }

    const SubmitPatientTest = async () => {

        if (!patientData || selectedTest.length === 0) {

            alert("Missing patient data or no tests selected.");
            return;

        }
    
        try {
            const response = await axios.post(
                "/api/user/patient-assign-flow/assigning/test",
                {
                    patient_id: patientData.id,
                    tests: selectedTest.map(test => ({ id: test.id, name: test.name })),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("Success:", response.data);
        } catch (error) {
            console.error("Error submitting data:", error.response?.data || error);
        }
    };

    return (
        <div>
            {/* loading UI starts here */}
            {loading}
            {messages}
            {/* ends here */}


            {/* Search module UI starts here */}
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search For Test Here... eg Blood Test"
                className="mx-4 form-control col-md-7 mt-3"
            />
    

            {userCard}
            {suggestionJSX}


            {/* patient data UI starts here  */}
            <div className="container mt-5">
                {patientData ? (
                    <div className="card shadow-lg p-4">
                        <div className="row">
                            {/* Profile Picture Column */}
                            <div className="col-md-4">
                                <div className="d-flex justify-content-center align-items-center bg-primary text-white rounded-circle" style={{ width: '100px', height: '100px' }}>
                                    <span style={{ fontSize: '2rem' }}>{patientData.name[0]}</span>
                                </div>
                            </div>

                            {/* Patient Details in 3 Columns */}
                            <div className="col-md-4">
                                <h5 className="fw-bold">{patientData.name}</h5>
                                <p><strong>Age:</strong> {patientData.age}</p>
                                <p><strong>Sex:</strong> {patientData.sex}</p>
                            </div>

                            <div className="col-md-4">
                                <p><strong>Phone:</strong> {patientData.phone}</p>
                                <p><strong>Email:</strong> {patientData.email}</p>
                                <p><strong>Location:</strong> {patientData.village}, {patientData.district}, {patientData.state}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            {/* patient data UI ends here */}

            {/* Render selected items with an image */}
            {selected.length > 0 && (
                <div>
                    {selected.map((item, index) => (
                        <div key={index} className="row col-12 mt-4 mx-2 d-flex align-items-center">
                            <label className="fw-bold">{item.name}</label>
                            <input
                                type="checkbox"
                                name={item.name}
                                value={item.id}
                                className="form-check-input"
                                style={{ verticalAlign: 'middle' }}
                                onClick={() => handleCheckboxChange(item)} // Add onClick here
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Render selectedTest items with image */}
            {selectedTest.length > 0 && (
                    <div className="mt-4">
                        <h4>Selected Tests</h4>
                        
                        {selectedTest.map((test, index) => (
                            <div key={index} className="row col-12 mt-3 mx-2 d-flex align-items-center">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={labIcon} 
                                        alt="Lab Icon" 
                                        style={{ width: '35px', height: '25px' }} 
                                    />
                                    <span className="fw-bold">{test.name}</span>
                                </div>
                            </div>
                        ))}

                    </div>
            )}

        
        <div className='mt-5 text-center'>
            <button className='btn btn-outline-danger btn-lg' onClick={SubmitPatientTest}>Assign Test To Patient {patientData?.name}</button>
        </div>


        </div>
    );
};

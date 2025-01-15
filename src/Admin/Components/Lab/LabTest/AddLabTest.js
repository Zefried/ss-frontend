import React, { useEffect } from 'react'
import { useState } from 'react';
import { customStateMethods } from '../../../../StateMng/Slice/AuthSlice';
import axios from 'axios';


export const AddLabTest = () => {

    let token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);

    const [serverResponse, setServerResponse] = useState({
      validation_error:{},
      message:{},
      error:{},
    }); 

    // fetching, storing and displaying testCategory data starts here
    const [testCategoryData, setTestCategoryData] = useState('');

    useEffect(()=>{

        try {
        
            axios.get('sanctum/csrf-cookie').then(response => {
                axios.get('api/admin/lab-test/fetch-test-category', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
                })
                .then((res) => {
    
                    setServerResponse((prevData)=>(
                        {...prevData, 
                        validation_error:res.data.validation_error, 
                        message:res.data.message, 
                        error:res.data.error}
                    ))
        
                    if(res.data.status !== 200){ 
                        setMessages(customStateMethods.getAlertDiv(res.data.message));  
                    } else{
                        setTestCategoryData(res.data.test_category_data);
                        setMessages(customStateMethods.getAlertDiv(res.data.message));
                    }
    
                    setLoading(false);
                    resetMessages();
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);  // Handle API error
                });
            });
    
            } catch (error) {
            console.log(error);  // Handle any unexpected errors
            }

    },[])

    let testCategoryJsx = '';
    
    if(testCategoryData){
      
        testCategoryJsx = testCategoryData.map((category) => (
            <option key={category.id} value={category.id}>
            {category.name}
            </option>                        
        )); 
            
    }

    // ends here



    const [testData, setTestData] = useState({
        name:'',
        description:'',
        status:'on',
    });

    const handleChange = (e) => {
        setTestData((prevItem)=>(
            {...prevItem, [e.target.name]:e.target.value}
        ));
    }

    function resetMessages() {
        setTimeout(()=>{
            setMessages(false)
        },3000)
    }
  

    function handleSubmit(e){
        e.preventDefault();
        setLoading(customStateMethods.spinnerDiv(true));

        try {
        
        axios.get('sanctum/csrf-cookie').then(response => {
            axios.post('api/admin/lab-test/add-lab-test', testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
            })
            .then((res) => {

                setServerResponse((prevData)=>(
                    {...prevData, 
                    validation_error:res.data.validation_error, 
                    message:res.data.message, 
                    error:res.data.error}
                ))
    
                if(res.data.status !== 200){ 
                    setMessages(customStateMethods.getAlertDiv(res.data.message));  
                } else{
                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                }

                setLoading(false);
                resetMessages();
            })
            .catch(error => {
                setLoading(false);
                console.log(error);  // Handle API error
            });
        });

        } catch (error) {
        console.log(error);  // Handle any unexpected errors
        }
    }

    console.log(testData);

    


  return (
    <div>
        {loading}
        {messages}
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="card shadow-lg p-4">
                        <h2 className="card-title text-center mb-4">Add Lab Test</h2>

                        <form>
                            <div className="form-group mb-3">
                                <label htmlFor="category" className="form-label">Select Test Category</label>
                                <select
                                    name="test_category_id"
                                    className="form-select col-lg-5"
                                    id="category"
                                    value={testCategoryData.id}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {testCategoryJsx}
                                  
                                </select>
                                <span style={{ color: 'orange' }}>
                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.test_category_id : ''}
                                </span>
                            </div>
                               

                            <div className="form-group mb-3">
                                <label htmlFor="name" className="form-label">Test Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    className="form-control"
                                    id="name"
                                    value={testData.name}
                                    placeholder="Enter test name"
                                    onChange={handleChange}
                                />
                                <span style={{ color: 'orange' }}>
                                    {serverResponse && serverResponse.validation_error ? serverResponse.validation_error.name : ''}
                                </span>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    rows="3"
                                    name='description'
                                    value={testData.description}
                                    placeholder="Enter category description"
                                    onChange={handleChange}
                                ></textarea>

                                <span style={{ color: 'orange' }}>
                                    {serverResponse && serverResponse.validation_error ? serverResponse.description : ''}
                                </span>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name='status'
                                        id="status"
                                        checked={testData.status}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="status">
                                        Active
                                    </label>

                                    <span style={{ color: 'orange' }}>
                                        {serverResponse && serverResponse.validation_error ? serverResponse.status : ''}
                                    </span>

                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <button type="submit" onClick={handleSubmit} className="btn btn-primary btn-lg">
                                    Save Lab Test
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

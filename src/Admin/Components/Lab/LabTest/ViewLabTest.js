import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { customStateMethods } from '../../../../StateMng/Slice/AuthSlice';
import labIcon from '../../../../assets/img/lab/labIcon.jpg';

export const ViewLabTest = () => {

    let token = customStateMethods.selectStateKey('appState', 'token');

    const [loading, setLoading] = useState(null);
    const [disable, setDisable] = useState(0); 

    const [messages, setMessages] = useState(null);
    const [testCategoryData, setTestCategoryData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [selectedTestCategoryId, setSelectedTestCategoryId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);


    
     // Search Module state starts from here
     const [query, setQuery] = useState('');
     const [suggestions, setSuggestions] = useState([]);
     const [selected, setSelected] = useState(null);
     // ends here 



    useEffect(() => {
        setLoading(customStateMethods.spinnerDiv(true));

        axios.get('sanctum/csrf-cookie').then(() => {
            axios.get('api/admin/lab-test/fetch-test-category', {
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                if (res.data.status === 200) {
                    setTestCategoryData(res.data.test_category_data);
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error fetching categories:', error);
            });
        });
    
    }, [disable]);



    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedTestCategoryId(categoryId);

        if (categoryId) {
            setLoading(customStateMethods.spinnerDiv(true));
            axios.get(`api/admin/lab-test/fetch-test/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                setTestData(res.data.test_data[0]);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error fetching test data:', error);
            });
        }
    };

    
    // Calculate indexes for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentTestData = testData.tests ? testData.tests.slice(indexOfFirstRecord, indexOfLastRecord) : [];
    const totalPages = testData.tests ? Math.ceil(testData.tests.length / recordsPerPage) : 0;

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    async function handleDisable(id){
        
        setLoading(true);

        try {
            await axios.get('sanctum/csrf-cookie');
            
            const res = await axios.get(`api/admin/lab-test/disable-test/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.status === 200) {
                // Toggle the disable state
                setDisable(prevDisable => (prevDisable === '0' ? '1' : '0'));
                window.location.reload();
            } else {
                customStateMethods.getAlertDiv(res.data.message);
                console.error('Error disabling category:', res.data.message);
            }
    
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const paginatedTestJsx = currentTestData.map((testItems, index) => (
        <tr key={testItems.id}>
            <td>{indexOfFirstRecord + index + 1}</td>
            <td>
                <img className='labIcon' src={labIcon} alt="Lab Icon" style={{ height: '35px', width: '35px' }} />
            </td>
            <td>{testItems.name}</td>
            <td>{testItems.status === 'on' ? 'Active' : 'Inactive'}</td>
            <td>
                <Link className='btn btn-outline-primary btn-sm' to={`/admin/edit-lab-test/${testItems.id}`}>Edit</Link>
            </td>
            <td>
               <button className='btn btn-outline-danger btn-sm' onClick={()=>handleDisable(testItems.id)}>Disable</button>
            </td>
        </tr>
    ));

      /////// Search Module Functions starts from here
 
      const handleSearch = async (e) => {
        setLoading(customStateMethods.spinnerDiv(true));
    
        const searchValue = e.target.value;
        setQuery(searchValue);
    
        // Fetching suggestions from the API
        if (searchValue.length > 1) {
    
          try {
    
            const response = await axios.get(`/api/admin/lab-test/search-lab-test?query=${searchValue}`, {
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
    
      const handleSuggestionClick = (name, id) => {
        setSelected({ name, id });
        setQuery(''); // Updating the input field with the empty string to restrict api call when backspacing 
        setSuggestions([]); // Clearing suggestions
      };

    /////// Search Module Functions ends here


     // Custom JSX starts from here
 
           //////// Search Module Custom JSX starts from here
 
           let userCard = '';
           let suggestionJSX = '';
           let selectedOneItemJsx = '';
 
            if (suggestions && suggestions.length > 0) {
                userCard = suggestions.map(({ name, id, }) => (
                    <ul className="row list-group" key={id} onClick={() => handleSuggestionClick(name, id)} style={{ cursor: 'pointer' }}>
                        <li className="list-group-item col-md-6 text-dark mt-3 mx-4">
                            <strong>id:</strong> {id} | <strong>Test Name:</strong> {name}
                        </li>
                    </ul>
                ));
            } 
         
            if (!selected) {
                suggestionJSX = (
                    <p className='m-3 mx-4 text-dark'>No Suggestions...</p>
                );
            } else {
                suggestionJSX = '';
            }
 
            //////// Search Module Custom JSX ends here
     
        console.log(selected);

    return (
        <div>
            {loading}
            {messages}

             {/* Search module UI starts here  */}

            <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search by phone or unique ID"
            className="mx-4 form-control col-md-7 mt-3"
            />


                {userCard}
                {suggestionJSX}
         

            {
                selected && (
                    <div className='row col-4 mt-4 mx-2'>
                        <div className='card'>
                            <h4 className='mt-4 text-center'>Selected</h4>
                            <p><strong>Test Id:</strong> {selected.id}</p>
                            <p><strong>Test Name:</strong> {selected.name}</p>  
                            <td className='text-center m-3'>
                                <button className='btn btn-outline-danger btn-sm'>Disable</button>
                            </td>
                            <td className='text-center mb-1'>
                                <Link className='btn btn-outline-primary btn-md' to={`/admin/edit-lab-test/${selected.id}`}>Edit</Link>
                            </td>
                        </div>
                    </div>
            
                )       
            }


             {/* ends here */}


            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card shadow-lg p-4">
                            <h2 className="card-title text-center mb-4">View Lab Tests</h2>

                            {/* Select Test Category */}
                            <div className="form-group mb-3">
                                <label htmlFor="category" className="form-label">Select Test Category</label>
                                <select
                                    name="test_category_id"
                                    className="form-select col-lg-5"
                                    id="category"
                                    value={selectedTestCategoryId}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select Category</option>
                                    {testCategoryData && testCategoryData.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Lab</th>
                                <th>Test Name</th>
                                <th>Status</th>
                                <th>Edit</th>
                                <th>Disable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTestJsx}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages).keys()].map(page => (
                            <li key={page} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageClick(page + 1)}>{page + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>


           
        </div>
    );
};

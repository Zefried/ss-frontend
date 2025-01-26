import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import location from '../../../assets/img/location/location.jpg';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';

export const ViewPatientLocation = () => {


        // inline edit state starts here

        const [isEditing, setIsEditing] = useState(false);
        const [editedValue, setEditedValue] = useState('');
        const [editingId, setEditingId] = useState(null);

        // ends here 



        // Additional State starts from here
        const token = customStateMethods.selectStateKey('appState', 'token');
        const [loading, setLoading] = useState(null);
        const [messages, setMessages] = useState(null);
        const [disable, setDisable] = useState(0);
        const [error, setError] = useState('');
        // ends here


        
        // Response data starts from here

            //////// List View Data starts from here
            const [listData, setListData] = useState({
                items: [],
                total: '',
                lastPage: '',
                // storing associated user data for doctor or Sewek reference in patient assigned table 
                associated_user_email: '',
                associated_user_id:'',
            });
            /////// ends here



        // Search Module state starts from here
        const [query, setQuery] = useState('');
        const [suggestions, setSuggestions] = useState([]);
        const [selected, setSelected] = useState(null);
        // ends here 


        // Pagination state starts from here
          const [currentPage, setCurrentPage] = useState(1);
          const [recordsPerPage, setRecordsPerPage] = useState(10);
          let totalRecords = listData.total;
          const totalPages = Math.ceil(totalRecords / recordsPerPage);   
        // ends here


        // clear Message 
        function clearMessages(){
            setTimeout(()=>{
                setMessages('');
            },2000)
     
        }

        // UseEffects Order Starts from here

            //////// fetching list items and pagination starts here
              useEffect(() => {
                try {
                    setLoading(customStateMethods.spinnerDiv(true));
                    axios.get('sanctum/csrf-cookie').then(response => {
                        axios.post(`/api/user/patient-location/fetch-patient-location?page=${currentPage}&recordsPerPage=${recordsPerPage}`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then((res) => {
                                console.log(res.data);
                                
                                if (res.data.status === 200) {
                                    setListData({
                                        items: res.data.list_data,
                                        total: res.data.total,
                                        lastPage: res.data.last_page,
                                        
                                        associated_user_email:res.data.userData.email,
                                        associated_user_id:res.data.userData.id,
                                    });

                                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                                    clearMessages()

                                } else if(res.data.status === 204) {
                                    setListData({
                                        items: res.data.list_data,
                                    });
                                    clearMessages()
                                } else{
                                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                                    clearMessages()
                                }
                                setLoading(false);
                            });
                    });
                } catch (error) {
             
                    setLoading(false);
                    console.log(error.message);
                    clearMessages()
                }


            }, [currentPage, recordsPerPage, disable]);
            //////// ends here


        // ends here







          /////// Pagination functions starts from here

          const getPageCount = () => {
              let pageCount = [];
              let startPage = currentPage - 1;
              if (startPage < 1) startPage = 1;

              let endPage = currentPage + 2;
              if (endPage > totalPages) endPage = totalPages;

              for (let i = startPage; i <= endPage; i++) {
                  pageCount.push(i);
              }

              return pageCount;
          };

          const handlePageClick = (page) => {
              setCurrentPage(page);
          };

          function handleRow(e){
              
              let value = parseInt(e.target.value, 10);

              if (!isNaN(value)) {
                  setRecordsPerPage(value);
              } else {
                  console.log("Invalid number selected");
              }
          }

          /////// Pagination functions ends here


         /////// Search Module Functions starts from here

         const handleSearch = async (e) => {
          setLoading(customStateMethods.spinnerDiv(true));
      
          const searchValue = e.target.value;
          setQuery(searchValue);
      
          // Fetching suggestions from the API
          if (searchValue.length > 1) {
      
            try {
      
              const response = await axios.get(`/api/admin/search-users?query=${searchValue}`, {
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
      
        const handleSuggestionClick = (id, phone, email, name, workDistrict) => {
          setSelected({ id, phone, email, name, workDistrict });
          setQuery(phone); // Updating the input field with the selected phone number
          setSuggestions([]); // Clearing suggestions
        };
      

        /////// Search Module Functions ends here


        /////// Disable & clear messages function starts here

        function handleDisable(id){

            try{
    
                setLoading(customStateMethods.spinnerDiv(true));
    
                axios.get('sanctum/csrf-cookie').then(response => {
                    axios.get(`/api/user/patient-location/disable-patient-location/${id}`,{
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      })
                      .then((res) => {
                          if(res.data.status === 200){
                            setMessages(customStateMethods.getAlertDiv(res.data.message))
    
                            setDisable((prevData) => {
                                let newState = 0;
                                return prevData !== newState ? 0 : 1;
                            });

                            clearMessages();
    
                          }else{
                            
                            setMessages(customStateMethods.getAlertDiv(res.data.message))
                            clearMessages();
                          }
                          if(res.data){
                            setLoading(false);
                          }
                      })
                });
            }catch(error){
                setLoading(false);
                console.log(error);
                clearMessages();
            }
        }


        function clearMessages(){
            setTimeout(()=>{
                setMessages('');
            },5000)
        }

        /////// Disable & clear function Ends here     


    // Inline edit functions start here
        const handleEditClick = (id, currentValue) => {
            setIsEditing(true);
            setEditedValue(currentValue);
            setEditingId(id);
        };

        const handleInputChange = (e) => {
            setEditedValue(e.target.value);
        };

        const handleSave = (id) => {
            const data = {
                id: id,           
                location_name: editedValue   
            };

            try {
                setLoading(customStateMethods.spinnerDiv(true));
                axios.get('sanctum/csrf-cookie').then(response => {
                    axios.post(`/api/user/patient-location/update-patient-location`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                    .then((res) => {
                        console.log(res.data);

                        if (res.data.status === 200) {
                            // Update the listData state with the new location_name
                            const updatedListData = listData.items.map(item => 
                                item.id === id ? { ...item, location_name: editedValue } : item
                            );
                            

                            alert(res.data.message)
                            // Set the updated listData state
                            setListData((prevState) => ({
                                ...prevState,
                                items: updatedListData
                            }));

                            // Reset editing state
                            setIsEditing(false);
                            setEditingId(null);
                            setEditedValue("");
                        }

                        setLoading(false);
                    }).catch(error => {
                        setLoading(false);
                        console.error("Error updating location: ", error);
                    });
                });
            } catch (error) {
                setLoading(false);
                console.error(error.message);
            }
        };

// Inline edit functions end here

// JSX for rendering table
let mainTable = listData?.items.map((items, index) => (
    <tr key={items.id}>
        <td>{index + 1}</td>
        <td>{items.location_name}</td>
        <td>
            {isEditing && editingId === items.id ? (
                <div>
                    <input
                        type="text"
                        value={editedValue}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                    <button onClick={() => handleSave(items.id)} className="btn btn-outline-success btn-sm">Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                </div>
            ) : (
                <div>
                    {items.location_name || 'N/A'}
                    <button onClick={() => handleEditClick(items.id, items.location_name)} className="btn btn-outline-success btn-sm mx-2">Edit</button>
                </div>
            )}
        </td>
        <td>
            <Link className="btn btn-outline-danger btn-sm" onClick={()=>handleDisable(items.id)}>Disable</Link>
        </td>
    </tr>
));

// JSX Rendering
return (
    <div>
        {/* loading UI */}
        {loading}
        {messages}


        {/* error message */}
        {error && (
            <div className="alert alert-warning" role="alert">
                Your session might have expired please login again!
            </div>
        )}



        {/* drop down for table row selection */}
        <div className='drop-down mt-5 col-lg-6' >
                    <select class="form-select col-3" aria-label="Default select example"onClick={handleRow} >
                        <option defaultValue={"5"} >Select Row</option>
                        <option value="5">05</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="100">500</option>
                        <option value="100">1000</option>
                    </select>
        </div>
        {/* drop down for table row selection */}



        {/* Table of Locations */}
        <div className="table-responsive table-container">  
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Location Name</th>
                        <th>Edit Location</th>
                        <th>Disable Location</th>
                    </tr>
                </thead>
                <tbody>
                    {mainTable}
                </tbody>
            </table>
        </div>



        {/* Pagination */}
        {!selected && (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={`${currentPage === 1 ? 'disabled' : 'active'}`}>
                        <a className="page-link" onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>Previous</a>
                    </li>
                    {getPageCount().map((page) => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <a className="page-link" onClick={() => handlePageClick(page)}>
                                {page === getPageCount().length ? `...${page}` : page}
                            </a>
                        </li>
                    ))}
                    <li className={`${currentPage === totalPages ? 'disabled' : 'active'}`}>
                        <a className="page-link" onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>Next</a>
                    </li>
                </ul>
            </nav>
        )}


    </div>
);

}
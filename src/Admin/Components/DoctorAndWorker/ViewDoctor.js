import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import userIcon from '../../../assets/img/user/userIcon.png';
import { customStateMethods } from '../../../StateMng/Slice/AuthSlice';



export const ViewDoctors = () => {


    // Additional State starts from here
    const token = customStateMethods.selectStateKey('appState', 'token');
    const [loading, setLoading] = useState(null);
    const [messages, setMessages] = useState(null);
    const [disable, setDisable] = useState(0);
    // ends here


    // Response data starts from here


        //////// List View Data starts from here
        const [listData, setListData] = useState({
            items: '',
            total: '',
            lastPage: '',
        });
        /////// ends here



    // Response Data ends here


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


    // UseEffects Order Starts from here

            //////// fetching list items and pagination starts here
            useEffect(() => {
                try {
                    setLoading(customStateMethods.spinnerDiv(true));
                    axios.get('sanctum/csrf-cookie').then(response => {
                        axios.post(`/api/admin/doctors/view-doctor?page=${currentPage}&recordsPerPage=${recordsPerPage}`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        })
                            .then((res) => {
                                console.log(res.data);
                                if (res.data.status === 200) {
                                    setListData({
                                        items: res.data.listData,
                                        total: res.data.total,
                                        lastPage: res.data.last_page,
                                    });
                                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                                } else if(res.data.status === 204) {
                                    setListData({
                                        items: res.data.listData,
                                    });
                                } else{
                                    setMessages(customStateMethods.getAlertDiv(res.data.message));
                                }
                                setLoading(false);
                            });
                    });
                } catch (error) {
                    setLoading(false);
                    console.log(error);
                }

                clearMessages();
            }, [currentPage, recordsPerPage, disable]);
            //////// ends here


    // ends here

  
    // Functions Order Starts from here 

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
        
                const response = await axios.get(`/api/admin/doctors/search-users?query=${searchValue}`, {
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
            setQuery(''); // Updating the input field with empty string
            setSuggestions([]); // Clearing suggestions
          };
        

        /////// Search Module Functions ends here


        /////// Disable & clear messages function starts here

        function handleDisable(id){

            try{
    
                setLoading(customStateMethods.spinnerDiv(true));
    
                axios.get('sanctum/csrf-cookie').then(response => {
                    axios.get(`/api/admin/doctors/disable-doctor/${id}`,{
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
    
                           }else{
                            setMessages(customStateMethods.getAlertDiv(res.data.message))
                           }
                          if(res.data){
                            setLoading(false);
                          }
                      })
                });
            }catch(error){
                setLoading(false);
                console.log(error);
            }
        }

        function clearMessages(){
            setTimeout(()=>{
                setMessages('');
            },5000)
        }

        /////// Disable & clear function Ends here     


    // ends here



    // Custom JSX starts from here

          //////// Search Module Custom JSX starts from here

          let userCard = '';
          let suggestionJSX = '';
          let selectedOneItemJsx = '';

          if (suggestions && suggestions.length > 0) {
              userCard = suggestions.map(({ id, phone, email, name, workDistrict }) => (
                  <ul className="row list-group" key={id} onClick={() => handleSuggestionClick(id, phone, email, name, workDistrict)} style={{ cursor: 'pointer' }}>
                      <li className="list-group-item col-md-6 text-dark mt-1">
                          <strong>Name:</strong> {name} | <strong>Phone:</strong> {phone} | <strong>District:</strong> {workDistrict}
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
                selectedOneItemJsx = (
                    <tr key={selected.id} className="text-center">
                        <td>{selected.id}</td> 
                        <td>
                            <img style={{ height: '40px', width: '40px' }} className='userIcon img-fluid' src={userIcon} alt="User Icon" />
                        </td>
                        <td>{selected.name}</td> 
                        <td>{selected.workDistrict}</td>
                        <td>{selected.sex}</td>
                        <td>{selected.phone}</td>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>{selected.email}</td>
                        <td>
                            <Link to={`/admin/edit-doctor/${selected.id}`} className='btn btn-outline-success btn-sm w-100'>
                                Edit
                            </Link>
                        </td>
                        <td>
                            <Link to={`/admin/doc-credentials/${selected.id}`} className='btn btn-outline-primary btn-sm w-100'>
                                Credentials
                            </Link>
                        </td>
                        <td>
                            <Link to={`/admin/full-information/${selected.id}`} className='btn btn-outline-primary btn-sm w-100'>
                                Full Info
                            </Link>
                        </td>
                        <td>
                            <button className='btn btn-outline-danger btn-sm w-100' onClick={() => handleDisable(selected.id)}>
                                Disable
                            </button>
                        </td>
                    </tr>
                );
        }
        

           //////// Search Module Custom JSX ends here
    



          //////// List data view custom jsx starts here

            let listDataView = '';

            if (listData.items && listData.items.length > 0) {
                listDataView = listData.items.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                            <img style={{ height:'40px', width:'40px' }} className='userIcon' src={userIcon} alt="User Icon" />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.workDistrict}</td>
                        <td>{item.sex}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>
                            <Link to={`/admin/edit-doctor/${item.id}`} className='btn btn-outline-success btn-sm'>Edit</Link>
                        </td>
                        <td>
                            <Link to={`/admin/doc-credentials/${item.user_id}`} className='btn btn-outline-primary btn-sm'>Credentials</Link>
                        </td>
                        <td>
                            <Link to={`/admin/full-information/${item.id}`} className='btn btn-outline-primary btn-sm'>Full Info</Link>
                        </td>
                        <td>
                            <button className='btn btn-outline-danger btn-sm' onClick={() => handleDisable(item.id)}>Disable</button>
                        </td>
                    </tr>
                ));
            } else {
                
                listDataView = (
                    <tr>
                        <td colSpan="12" className="text-center">No data available</td>
                    </tr>
                );
            }
                
          //////// List data view custom jsx ends here

    // ends here
         

    return (
        <div>

        {/* loading UI starts here */}
            {loading}
            {messages}
        {/* ends here */}


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
                            <p><strong>Email:</strong> {selected.email}</p>
                            <p><strong>Location:</strong> {selected.workDistrict}</p>
                            <p><strong>Phone:</strong> {selected.phone}</p>  
                        </div>

                      
                    </div>
            
                )       
            }

        {/* Search module UI ends here */}


            

        {/* pagination UI starts from here */}

            <div className="container mt-5">
                <div className='drop-down mt-5'>
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

                <h2 className="text-center mb-4">User Information</h2>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>S.No</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Sex</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Edit</th>
                            <th>Acc Cred</th>
                            <th>Full Info</th>
                            <th>Disable</th>
                        </tr>
                        </thead>
                        <tbody>
                         {!selected ? listDataView : selectedOneItemJsx}
                        </tbody>
                    </table>
                </div>

                
                {
                    !selected && (
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
                    ) 
                }
                    
            </div>


        {/* pagination UI ends here */}



        </div>
    )
}

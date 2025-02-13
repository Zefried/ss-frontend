import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import labIcon from '../../../../assets/img/lab/labIcon.jpg';
import { customStateMethods } from '../../../../StateMng/Slice/AuthSlice';

export const ViewTestCategory = () => {

    const token = customStateMethods.selectStateKey('appState', 'token');
    
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(false); // Disable state for the button

    const [testCategoryData, setTestCategoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0); // Total number of records

    useEffect(() => {
        const fetchData = async () => {
            setLoading(customStateMethods.spinnerDiv(true));

            try {
                await axios.get('sanctum/csrf-cookie');
                const res = await axios.get(`api/admin/lab-test/fetch-test-category?page=${currentPage}&recordsPerPage=${recordsPerPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.status === 200) {
                    setTestCategoryData(res.data.test_category_data);
                    setTotalRecords(res.data.total); // Set total records from the API response
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        console.log(disable);
        
    }, [token, currentPage, recordsPerPage, disable]); // Include currentPage and recordsPerPage in dependencies



    const totalPages = Math.ceil(totalRecords / recordsPerPage);

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
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRow = (e) => {
        let value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setRecordsPerPage(value);
            setCurrentPage(1); // Reset to the first page when records per page change
        } else {
            console.log("Invalid number selected");
        }
    };


    async function handleDisable(id){
            setLoading(true);

            try {
                await axios.get('sanctum/csrf-cookie');
                
                const res = await axios.get(`api/admin/lab-test/disable-test-category/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.status === 200) {
                    // Toggle the disable state its a number not a string 
                    setDisable((state) => {
                        return state ? false : true;
                    });
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

    if (disable) {
        window.location.reload();
    }
    

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">View Test Categories</h2>
            {loading ? (
                <div>{loading}</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
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
                            {testCategoryData.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{(currentPage - 1) * recordsPerPage + index + 1}</td> {/* Adjusted global index */}
                                    <td>
                                        <img className='labIcon' src={labIcon} alt="Lab Icon" style={{ height: '35px', width: '35px' }} />
                                    </td>
                                    <td>{category.name}</td>
                                    <td>Active</td>
                                    <td>
                                        <Link className='btn btn-outline-primary btn-sm' to={`/admin/edit-lab-test-category/${category.id}`}>Edit Category</Link>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDisable(category.id)} className='btn btn-outline-danger btn-sm'>Disable</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="container mt-3">
                <div className='row no-gutters'>
                    <div className='drop-down col-lg-2'>
                        <select className="form-select" aria-label="Default select example" onChange={handleRow}>
                            <option defaultValue={"5"}>Select Row</option>
                            <option value="5">05</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                    <div className='col-lg-6'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>Previous</button>
                                </li>
                                {getPageCount().map((page, index) => (
                                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageClick(page)}>
                                            {page === 1 && currentPage > 3 ? `...` : page}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>Next</button>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageClick(totalPages)}>Last</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};
